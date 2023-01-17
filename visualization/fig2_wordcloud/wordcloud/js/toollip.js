function showTooltip(obj,id,html,width,height){
    if(document.getElementById(id)==null){
        var tooltipbox;
        tooltipBox = document.createElement("div");
        tooltipBox.className = className;
        tooltipBox.id = id;
        tooltipBox.innerHTML = html;

        obj.appendChild(tooltipBox);

        tooltipBox.style.width = width?width+"px":'auto';
        tooltipBox.style.height = height?height+'px':'auto';

        tooltipBox.style.position = 'absolute';
        tooltipBox.style.display = 'block';

        var left = obj.offsetLeft;
        var top = obj.offsetTop+20;

        tooltipBox.style.left = left+"px";
        tooltipBox.style.top = top+"px";

        obj.onmouseout = function(){
            document.getElementById(id).style.dispaly = 'none';
        }
    }else{
      document.getElementById(id).style.display = "block";
    }
}

var w1 = document.getElementById('w1');
w1.onmousemove = function(){
  showTooltip(this,'w1','9420',50);
}
