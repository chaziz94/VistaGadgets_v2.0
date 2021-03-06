//---------------------------------------------
//  THIS CODE IS NOT APPROVED FOR USE IN/ON ANY OTHER UI ELEMENT OR PRODUCT COMPONENT.  
//  Copyright (c) 2006 Microsoft Corporation.  All rights reserved.
// ----------------------------------------------
// JavaScript Document
function createDragItem(object,zone,onDrag,isScroller,scrollObject)
{
	var clip=document.getElementById(object);
	clip.obj=null;
	clip.offsetX=0;
	clip.offsetY=0;
	clip.zone=zone;
	clip.onDrag=onDrag || null;
	clip.onStartDrag=null;
	clip.onEndDrag=null;
	clip.isScroller= isScroller || false;
	if(clip.isScroller)
	{
		clip.scrollItem=document.getElementById(scrollObject);
		clip.clipHLength=(clip.style.posHeight ? clip.style.posHeight : clip.height);
		clip.clipWLength=(clip.style.posWidth ? clip.style.posWidth : clip.width);
	}
	clip.onmousedown=startDrag;
	clip.onmouseup=endDrag;
	clip.onmousemove=isDragging;
	clip.resetToStart=resetToStart;
	clip.resetToEnd=resetToEnd;
}


function startDrag() {
	this.obj=event.srcElement;
  	this.obj.setCapture();
    this.offsetX= event.clientX - ((this.obj.offsetLeft) ? this.obj.offsetLeft : 0);
    this.offsetY = event.clientY - ((this.obj.offsetTop) ? this.obj.offsetTop : 0);
	if(this.isScroller)
	{
		var distanceToTravelH=this.scrollItem.scrollHeight-this.scrollItem.parentNode.style.posHeight;
		var distanceToTravelW=this.scrollItem.scrollWidth-this.scrollItem.parentNode.style.posWidth;
		this.scrollHRatio=distanceToTravelH/(this.zone[3]-this.zone[1]);
		this.scrollWRatio=distanceToTravelW/(this.zone[2]-this.zone[0]);//this.myClip.hScrollClipDistance;
	}
	if(this.onStartDrag)
		this.onStartDrag();
   return false;
}

// Drag an element
function isDragging() 
{
    if (this.obj) 
	{
		//output.innerHTML=this.scrollObjMin;
		var newY=event.clientY-this.obj.offsetY;
		var newX=event.clientX-this.obj.offsetX;
		var currentX=this.obj.style.posLeft;
		var currentY=this.obj.style.posTop;
		var moved=false;
		//output.innerHTML=newY+":"+currentY+":"+this.zone[3] ;
		if(newY>=this.zone[1] && newY<=this.zone[3] &&newY!=currentY)
		{
			//output.innerHTML="y is moving";
			if(this.isScroller)
				{
					if(this.scrollHRatio>0)
					{
						var change=newY-this.zone[1];
						this.scrollItem.style.posTop=0-(change*this.scrollHRatio);
						this.obj.style.posTop=newY;
					}
					/*if(newY==this.zone[1])	
						this.scrollItem.style.posTop=0;
					else
						this.scrollItem.style.posTop=0-(newY*this.scrollHRatio);*///this.clipHLength-(newY*this.scrollHRatio)		
				}
				else
					this.obj.style.posTop=newY;
				//output.innerHTML=this.scrollItem.style.posTop;
				moved=true;
		}
		if(newX>=this.zone[0] && newX<=this.zone[2] && newX!=currentX )
		{
			//output.innerHTML="x is moving";
			if(this.isScroller)
				{
					if(this.scrollWRatio>0)
					{
						var change=newX-this.zone[0];
						this.scrollItem.style.posLeft=0-(change*this.scrollWRatio);
						this.obj.style.posLeft=newX;
					}
					//this.scrollItem.style.posLeft=this.clipWLength-(newX*this.scrollWRatio);
				}
				else
					this.obj.style.posLeft=newX;
				moved=true;
		}
		if(this.onDrag && moved)
			this.onDrag(newX,newY);
     	event.cancelBubble = true;
       return false;
   }
}

// Turn selected element off
function endDrag() {
	if (this.obj) 
	{
      // output.innerHTML=this.scrollItem.style.posTop;
	   this.obj.releaseCapture();
		if(this.onEndDrag)
			this.onEndDrag();
	}
   this.obj = null;
}

function resetToStart()
{
	if(this.isScroller)
	{
		this.scrollItem.style.posTop=0;
		this.scrollItem.style.posLeft=0;
	}
	
	this.style.posLeft=this.zone[0];
	this.style.posTop=this.zone[1];

}

function resetToEnd()
{
	this.style.posLeft=this.zone[2];
	this.style.posTop=this.zone[3];
	if(this.isScroller)
	{
		this.scrollItem.style.posTop=this.scrollItem.style.posHeight-this.scrollItem.scrollHeight;
		this.scrollItem.style.posLeft=this.scrollItem.style.posWidth-this.scrollItem.scrollWidth;
	}	
}