const express = require('express');
const router = express.Router();
let nodes = [];
let endNodes=[];
let dot_step1={};
let state = "";
let nextPlayer = "Player 1";
let crossingNodes = {"1":[], "-1":[]};
[restNodes, checkValidation, checkDot, isCrossing, passDots] = require('../check')
const allNodes=[
    { x: 0, y: 0 }, { x: 0, y: 1 },
    { x: 0, y: 2 }, { x: 0, y: 3 },
    { x: 1, y: 2 }, { x: 2, y: 1 },
    { x: 3, y: 0 }, { x: 1, y: 1 },
    { x: 2, y: 0 }, { x: 1, y: 0 },
    { x: 3, y: 1 }, { x: 2, y: 2 },
    { x: 1, y: 3 }, { x: 2, y: 3 },
    { x: 3, y: 2 }, { x: 3, y: 3 }
  ];

router.get('/initialize',(req,res)=>{
    state = "INITIAL";
    step = true;
    nodes = [];
    endNodes=[];
    dot_step1={};
    nextPlayer = "Player 1";
    res.json({
        "msg": "INITIALIZE",
        "body": {
            "newLine": null,
            "heading": nextPlayer,
            "message": "Awaiting Player 1's Move"
        }
    });
});


const checkRestNodes = (point, restNodes) => {
    return point.some(item => {
        return restNodes.some( node=>{
            return (checkDot(item, node) && !checkValidation(nodes,[ ...passDots(item,node),node]) && !checkCrossing(item,node));
        })
    })
}


const checkCrossing = (dot_1, dot_2) => {
    const slope = (dot_1.y-dot_2.y)/(dot_1.x-dot_2.x);
    if(slope===1 || slope === -1){        
        const nodes = crossingNodes[-(dot_1.y-dot_2.y)/(dot_1.x-dot_2.x)];
        if(nodes.length>0){
            return nodes.some(([node1,node2])=>{
                return isCrossing(dot_1,dot_2,node1,node2);
            });
        }
    }
    return false;
}

router.post('/node-clicked',(req,res)=>{
    const point = req.body;

    switch(state){
        case "INITIAL":
            res.json({
                "msg": "VALID_START_NODE",
                "body": {
                    "newLine": null,
                    "heading": nextPlayer,
                    "message": "Select a second node to complete the line."
                }
            });
            nodes.push(point);
            endNodes.push(point);
            dot_step1 = point;
            state = "1_2";
            nextPlayer = "Player 1"
            break;
        case "1_2":
            if(checkDot(dot_step1,point) 
            && !checkValidation(nodes,[ ...passDots(dot_step1,point),point]) 
            && !checkCrossing(dot_step1,point)){
                state = "2_1";
                nextPlayer = "Player 2"
                nodes.push(...passDots(dot_step1,point),point);
                endNodes.push(point);
                const slope = (dot_step1.y-point.y)/(dot_step1.x-point.x);
                if(slope===1 || slope === -1){
                    crossingNodes[slope].push([dot_step1,point]);
                }

                unusedNodes = restNodes(allNodes,nodes);
                console.log(!checkRestNodes(endNodes,unusedNodes,nodes));
                if(!checkRestNodes(endNodes,unusedNodes,nodes)){
                    res.json({
                        "msg": "GAME_OVER",
                        "body": {
                            "newLine": {
                                "start": dot_step1,
                                "end": point
                            },
                            "heading": "Game Over",
                            "message": "Player 2 Wins!"
                        }
                    });
                    break;
                }
                
                res.json({
                    "msg": "VALID_END_NODE",
                    "body": {
                        "newLine": {
                            "start": dot_step1,
                            "end": point
                        },
                        "heading": nextPlayer,
                        "message": null
                    }
                });

            }else{
                state = "1_1";
                nextPlayer = "Player 1"
                endNodes.push(dot_step1);
                res.json({
                    "msg": "INVALID_END_NODE",
                    "body": {
                        "newLine": null,
                        "heading": nextPlayer,
                        "message": "Invalid move!"
                    }
                });
            }
            break;
        case "2_1":
            if(checkValidation(endNodes,[point])){

                endNodes = endNodes.filter(item => {
                    return (item.x !== point.x || item.y != point.y);
                });
                dot_step1 = point;
                state = "2_2";
                nextPlayer = "Player 2"
                res.json({
                    "msg": "VALID_START_NODE",
                    "body": {
                        "newLine": null,
                        "heading": nextPlayer,
                        "message": "Select a second node to complete the line."
                    }
                });
            }else{
                state = "2_1";
                nextPlayer="Player 2"
                res.json({
                    "msg": "INVALID_START_NODE",
                    "body": {
                        "newLine": null,
                        "heading": nextPlayer,
                        "message": "Not a valid starting position."
                    }
                });
            }
            break;
        case "2_2":

                if(checkDot(dot_step1,point) && !checkValidation(nodes,[ ...passDots(dot_step1,point),point]) && !checkCrossing(dot_step1,point)){
                    state = "1_1";
                    nextPlayer = "Player 1"
                    nodes.push(...passDots(dot_step1,point),point);
                    endNodes.push(point);
                    const slope = (dot_step1.y-point.y)/(dot_step1.x-point.x);
                    if(slope===1 || slope === -1){
                        crossingNodes[slope].push([dot_step1,point]);
                    }
                    unusedNodes = restNodes(allNodes,nodes);
                    console.log(!checkRestNodes(endNodes,unusedNodes,nodes));
                    if(!checkRestNodes(endNodes,unusedNodes,nodes)){
                        res.json({
                            "msg": "GAME_OVER",
                            "body": {
                                "newLine": {
                                    "start": dot_step1,
                                    "end": point
                                },
                                "heading": "Game Over",
                                "message": "Player 1 Wins!"
                            }
                        });
                        break;
                    }
                    res.json({
                        "msg": "VALID_END_NODE",
                        "body": {
                            "newLine": {
                                "start": dot_step1,
                                "end": point
                            },
                            "heading": nextPlayer,
                            "message": null
                        }
                    });
                }else{
                    state = "2_1";
                    nextPlayer = "Player 2"
                    endNodes.push(dot_step1);
                    res.json({
                        "msg": "INVALID_END_NODE",
                        "body": {
                            "newLine": null,
                            "heading": nextPlayer,
                            "message": "Invalid move!"
                        }
                    });
                }
                break;
            case "1_1":
                if(checkValidation(endNodes,[point])){

                    endNodes = endNodes.filter(item => {
                        return (item.x !== point.x || item.y != point.y);
                    });
                    dot_step1 = point;
                    state = "1_2";
                    nextPlayer = "Player 1"
                    res.json({
                        "msg": "VALID_START_NODE",
                        "body": {
                            "newLine": null,
                            "heading": nextPlayer,
                            "message": "Select a second node to complete the line."
                        }
                    });
                }else{
                    state = "1_1";
                    nextPlayer="Player 1"
                    res.json({
                        "msg": "INVALID_START_NODE",
                        "body": {
                            "newLine": null,
                            "heading": nextPlayer,
                            "message": "Not a valid starting position."
                        }
                    });
                }
                break;
    }

});

router.post("/error",(req,res)=>{
    res.json({
        "error": "Invalid type for `id`: Expected INT but got a STRING"
    });
});
module.exports = router;