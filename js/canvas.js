var canvas = document.getElementById('legend');
var ctx = canvas.getContext('2d');
var img = new Image();

var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

init();

var p = 6; //边缘留白


function init(){
	loadImg("../image/dong.jpg");
}

/**
 * load image
 */
function loadImg(url, effect){
	img.onload = function (ev){
		drawImage(img, effect || "self");
	}
	img.src = url;
}
/**
 * [drawImage ]
 */
function drawImage(img, effect){
	var w = img.width, h = img.height;
	canvas.width = w;
	canvas.height = h;

	ctx.drawImage(img, 0 ,0, w, h, 0, 0, w, h);

	if(effect == "self"){
		setDownload();
		return ;
	}

	var canvasData = ctx.getImageData(0, 0, w, h);
	var tempData = ctx.getImageData(0, 0, w, h);

    canvasData = F[effect](canvasData, tempData);
    ctx.putImageData(canvasData, 0, 0);

    setDownload();
}

/**
 * 切换效果
 */
var elEffects = $("#effects");
elEffects.on("change", function (){
	var v = $(this).val();
	drawImage(img, v)
})

/**
 * 上传图片
 */
$("#fileImg").on("change", function (){
	var files = $(this)[0].files;
	var reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = function() {
    	loadImg(reader.result, elEffects.val())
    }
    reader.onerror = function (){
    	var s = "读取文件出错!";
    	alert(s)
    	console.warn(s)
    }
})
var elImgBox = $(".img");
var elDown = $("#download");


var str = "下载图片";
if(mobile){
	str = "可长按图片保存";
}
elDown.find('button').text(str);


/**
 * download img
 */
function setDownload(){
	var type = 'png';
	var imgData = canvas.toDataURL(type);

	showImg(imgData);

	imgData = imgData.replace(fixType(type), 'image/octet-stream');
	var filename = 'donglegend' + (new Date()).getTime().toString(16) + '.' + type;
	elDown.attr('href', imgData).attr('download', filename);
}

/**
 * show img
 */
function showImg(data){
	var newImg = new Image();
	newImg.onload = function (){
		elImgBox.html(newImg)
	}
	newImg.src = data;
}

/**
 * 确定类型
 */
function fixType(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};



