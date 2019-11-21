const restNodes = (nodes1, nodes2) => {    
    var result = [];
    for(let i of nodes1){
        let isContained = false;
        for(let j of nodes2){
            if(i.x === j.x && i.y === j.y){
                isContained = true;
                break;
            }
        }
        if(!isContained){
            result.push(i);
        }
    }
    return result;
}

// const checkRestNodes = (point, restNodes,nodes) => {
//     return point.some(item => {
//         return restNodes.some( node=>{
//             return (checkDot(item, node) && !checkValidation(nodes,[ ...passDots(item,node),node]) && !checkCrossing(item,node,this.crossingNodes));
//         })
//     })
// }

const checkValidation = (nodes,points) => {    
    return points.some(element => {        
        return nodes.some( point =>{
            return (point.x === element.x && point.y === element.y);
        });
    });    
}

const checkDot = (dot_1, dot_2) => {
    const slope = (dot_1.y-dot_2.y)/(dot_1.x-dot_2.x);
    return [Infinity, -Infinity, 0, -1, 1].includes(slope);
}

const isCrossing = (a,b,c,d) => {
    if(Math.min(a.y,b.y)<=Math.max(c.y,d.y)&&Math.min(d.x,c.x)<=Math.max(a.x,b.x)&&Math.min(c.y,d.y)<=Math.max(a.y,b.y)&&Math.min(a.x,b.x)<=Math.max(c.x,d.x)){
        const u=(c.x-a.x)*(b.y-a.y)-(b.x-a.x)*(c.y-a.y); 
        const v=(d.x-a.x)*(b.y-a.y)-(b.x-a.x)*(d.y-a.y); 
        const w=(a.x-c.x)*(d.y-c.y)-(d.x-c.x)*(a.y-c.y); 
        const z=(b.x-c.x)*(d.y-c.y)-(d.x-c.x)*(b.y-c.y);
        return (u*v<0 && w*z<0);
    }
    return false;
}

// const checkCrossing = (dot_1, dot_2, crossingNodes={"1":[], "-1":[]}) => {
//     const slope = (dot_1.y-dot_2.y)/(dot_1.x-dot_2.x);
//     if(slope === 1 || slope === -1){   
//         console.log(slope)     
//         const nodes = crossingNodes[-slope];
//         if(nodes.length>0){
//             return nodes.some(([node1,node2])=>{
//                 return isCrossing(dot_1,dot_2,node1,node2);
//             });
//         }
//     }
//     return false;
// }



const passDots = (dot_1, dot_2)=>{
    const slope = (dot_1.y-dot_2.y)/(dot_1.x-dot_2.x);
    const result = [];
    if([Infinity, -Infinity, 0, -1, 1].includes(slope)){

        const arrY = [dot_1.y, dot_2.y];
        const arrX = [dot_1.x, dot_2.x];
        const rangeX = Math.abs(dot_1.x-dot_2.x);
        const rangeY = Math.abs(dot_1.y-dot_2.y);
        const minY = Math.min.apply(null, arrY);
        const minX = Math.min.apply(null, arrX);
        const minDot =  arrX.indexOf(minX) === 0? dot_1:dot_2;
        
        if(slope === Infinity || slope === -Infinity){
            for(let y=1; y<rangeY; y++){
                result.push({x:dot_1.x,y:minY+y});
            }
        }else{
            for(let x=1; x<rangeX; x++){
                result.push({x:x+minX, y:x*slope+minDot.y});
            }
        }
    }
   return result;
}

module.exports = [restNodes,  checkValidation, checkDot, isCrossing,  passDots];