//	var r2 = Math.sqrt(document.documentElement.clientWidth*document.documentElement.clientWidth+document.documentElement.clientHeight*document.documentElement.clientHeight);
		//	$("#allmap").css("width", document.documentElement.clientWidth);

		/*var xA = (r2 - document.documentElement.clientWidth)/2.0;
		var yA = (r2 - document.documentElement.clientHeight)/2.0;
			
		$("#allmap").css("margin-left",-xA);
		$("#allmap").css("margin-top",-yA);
		*/
		// 百度地图API功能
		var map = new BMap.Map('allmap');
		var MyPoi = new BMap.Point(103.958792, 30.781972);
		map.centerAndZoom(MyPoi, 14);
		map.enableScrollWheelZoom();

		var marker = new BMap.Marker(MyPoi);
		marker.getIcon().setImageUrl("img/point.png");
		marker.getIcon().setSize(new BMap.Size(33, 33));
		marker.getShadow().setSize(new BMap.Size(0, 0));
		marker.disableMassClear();


		map.addOverlay(marker); //在地图中添加marker

		var geolocation = new BMap.Geolocation();

		function moveToMyPoi() {
			map.setZoom(14);
			map.panTo(MyPoi);
		};

		geolocation.getCurrentPosition(function(r) {
			if(this.getStatus() == BMAP_STATUS_SUCCESS) {
				MyPoi = r.point;
				marker.setPosition(MyPoi);
				moveToMyPoi();
				var circle = new BMap.Circle(r.point,10000,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.9});/*创建一个圆实例*/
				map.addOverlay(circle);/*将圆添加到地图中*/
				
			} else {
				alert('failed' + this.getStatus());
			}
		}, {
			enableHighAccuracy: true
		})

		//获取定位
		function getMyPosition() {
			geolocation.getCurrentPosition(function(r) {
				if(this.getStatus() == BMAP_STATUS_SUCCESS) {
					MyPoi = r.point;
					marker.setPosition(MyPoi);
					//	map.panTo(MyPoi);
					//	alert('您的位置：' + r.point.lng + ',' + r.point.lat);
					var local =  new BMap.LocalSearch(map, {renderOptions: {map: map, autoViewport: false}}); /*查找*/
					local.searchNearby('洗车',r.point,10000);/*调用查找*/
					//定时再获取位置
					
					setTimeout(function() {
						getMyPosition();
					}, 5000);
				} else {
					alert('failed' + this.getStatus());
				}
			}, {
				enableHighAccuracy: true
			})
		};

		getMyPosition();

		function onPlusReady() {
			plus.orientation.watchOrientation(function(o) {
//					console.log(o.alpha);
				marker.setRotation(o.alpha);
			}, function(e) {
				alert("Orientation error: " + e.message);
			}, {
				frequency: 1
			});
		}
		document.addEventListener("plusready", onPlusReady, false);

		/*var local = new BMap.LocalSearch(map, {
			renderOptions: {
				map: map
			}
		});
		local.search("洗车");*/

		function SearchControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		SearchControl.prototype = new BMap.Control();
		SearchControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				width: "80%"
			});
			$(div).addClass("mui-input-row mui-search");
			$(div).html("<input id='suggestId' type='search' class='mui-input-clear' placeholder='请输入关键字'>");
			map.getContainer().appendChild(div);
			return div;
		}

		function MyLoControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		MyLoControl.prototype = new BMap.Control();
		MyLoControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				color: "#0861E7",
				padding: "0 4px 0 4px",
				border: "1px solid black",
				opacity: "0.5"
			});
			$(div).html("<i class='fa fa-location-arrow fa-2x'></i>");

			$(div).click(function() {
				moveToMyPoi();
			});
			map.getContainer().appendChild(div);
			return div;
		}

		//定义控件：开始导航
		function MyNaviControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		MyNaviControl.prototype = new BMap.Control();
		MyNaviControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				//	color: "#0861E7",
				//	padding: "0 4px 0 4px",
				//	border: "1px solid black",
				//	opacity: "0.5"
			});
			$(div).html('<div id="startNaviBtn" onclick="startNavi()" class="mui-btn mui-btn-primary">开始导航</div> <div id="endNaviBtn" onclick="reGetRoute()" class="mui-btn mui-btn-primary">重选目的地</div>');

			map.getContainer().appendChild(div);
			return div;
		}

		//定义函数：重选目的地
		function reGetRoute() {
			map.removeControl(myNaviControl);
			map.clearOverlays();
		};

		//定义控件：结束导航
		function MyEndNaviControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		MyEndNaviControl.prototype = new BMap.Control();
		MyEndNaviControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				//	color: "#0861E7",
				//	padding: "0 4px 0 4px",
				//	border: "1px solid black",
				//	opacity: "0.5"
			});
			$(div).html('<div class="mui-btn mui-btn-primary">结束导航</div>');

			$(div).click(function() {
				endNavi();
			});
			map.getContainer().appendChild(div);
			return div;
		}

		function MyStepControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		MyStepControl.prototype = new BMap.Control();
		MyStepControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				width: "100%"
				//	color: "#0861E7",
				//	padding: "0 4px 0 4px",
				//	border: "1px solid black",
				//	opacity: "0.5"
			});
			$(div).html('<div class="mui-card"><ul class="mui-table-view"><li id="step" class="mui-table-view-cell"></li></ul></div>');

			map.getContainer().appendChild(div);
			return div;
		}

		//定义控件：路径规划
		function MyRouteControl(posIndex, left, top) {
			var position = [BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_ANCHOR_BOTTOM_LEFT, BMAP_ANCHOR_BOTTOM_RIGHT];
			this.defaultAnchor = position[posIndex];
			this.defaultOffset = new BMap.Size(left, top);
		}
		MyRouteControl.prototype = new BMap.Control();
		MyRouteControl.prototype.initialize = function(map) {
			var div = document.createElement("div");
			$(div).css({
				//	color: "#0861E7",
				//	padding: "0 4px 0 4px",
				//	border: "1px solid black",
				//	opacity: "0.5"
			});
			$(div).html('<div class="mui-btn mui-btn-primary">去这里</div>');
			$(div).click(function() {
				walk();
			});
			map.getContainer().appendChild(div);
			return div;
		}

		var searchCtrl = new SearchControl(0, 30, 10);
		var myLoControl = new MyLoControl(2, 10, 50);
		var myNaviControl = new MyNaviControl(3, 50, 50);
		var myEndNaviControl = new MyEndNaviControl(3, 50, 50);
		var myRouteControl = new MyRouteControl(3, 50, 50);
		var myStepControl = new MyStepControl(3, 0, 100);
		map.addControl(searchCtrl);
		map.addControl(myLoControl);

		map.addEventListener("click", function() {
			$("#suggestId").blur();
		});
		map.addEventListener("moving", function() {
			$("#suggestId").blur();
		});

		var ac = new BMap.Autocomplete( //建立一个自动完成的对象
			{
				"input": "suggestId",
				"location": map
			});

		ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
			var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if(e.fromitem.index > -1) {
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

			value = "";
			if(e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			$("#searchResultPanel").html(str);
		});

		var myValue;
		ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
			var _value = e.item.value;
			myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
			$("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);

			setPlace();
		});

		var dest = null; //目的地
		var m1 = null;

		function setPlace() {
			$("#suggestId").blur();
			map.clearOverlays(); //清除地图上所有覆盖物
			function myFun() {
				dest = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
				map.centerAndZoom(dest, 18);
				m1 = new BMap.Marker(dest);
				m1.getIcon().setImageUrl("http://api0.map.bdimg.com/images/marker_red_sprite.png");
				map.addOverlay(m1); //添加标注
				map.addControl(myRouteControl);
				/*m1.addEventListener("click", function() {
					searchInfoWindow.open(m1);
				});
				searchInfoWindow.open(m1);*/

			}
			var local = new BMap.LocalSearch(map, { //智能搜索
				onSearchComplete: myFun
			});
			local.search(myValue);
		}

		var content = '<button id="bt1" type="button" class="mui-btn mui-btn-primary mui-btn-block" onclick="walk()">到这里去</button>';
		//创建检索信息窗口对象
		var searchInfoWindow = null;
		searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
			title: "路径规划", //标题
			width: 100, //宽度
			//	panel: "panel", //检索结果面板
			enableAutoPan: true, //自动平移
			searchTypes: [
				//	BMAPLIB_TAB_TO_HERE //到这里去
			]
		});

		var walking = new BMap.WalkingRoute(map, {
			renderOptions: {
				map: map,
				panel: "r-result",
				autoViewport: true
			}
		});

		//规划步行路径
		function walk() {
			walking.search(MyPoi, dest);

			walking.setSearchCompleteCallback(function() {
				map.removeControl(myRouteControl);
				map.addControl(myNaviControl);
				/*var result = walking.getResults();
				console.log("方案总数：" + result.getNumPlans());
				for(var i = 0; i < result.getNumPlans(); i++) {
					console.log("方案" + i + ":");
					var plan = result.getPlan(i);
					console.log("方案" + i + "的总距离：" + plan.getDistance());
					console.log("方案" + i + "的路线个数：" + plan.getNumRoutes());
					for(var j = 0; j < plan.getNumRoutes(); j++) {
						console.log("方案" + i + "，路线" + j + ":");
						var route = plan.getRoute(j);
						console.log("方案" + i + "，路线" + j + "的距离:" + route.getDistance());
						console.log("方案" + i + "，路线" + j + "的关键点个数:" + route.getNumSteps());
						for(var k = 0; k < route.getNumSteps(); k++) {
							console.log("方案" + i + "，路线" + j + "，关键点" + k + ":");
							var step = route.getStep(k);
							console.log("方案" + i + "，路线" + j + "，关键点" + k + "的描述：" + step.getDescription(false));
							console.log("方案" + i + "，路线" + j + "，关键点" + k + "到下一个关键点的距离：" + step.getDistance());

						}
					}
				}*/
			});

		};

		var cur_route = null;
		var cur_step_index = 0;

		//开始步行导航
		function startNavi() {
			map.removeControl(myNaviControl);
			map.addControl(myEndNaviControl);
			moveToMyPoi();
			cur_route = walking.getResults().getPlan(0).getRoute(0);
			cur_step_index = 0;
			map.addControl(myStepControl);
			$("#step").text(cur_route.getStep(0).getDescription(false));
			checkStep();
		};

		//结束步行导航
		function endNavi() {
			map.removeControl(myEndNaviControl);
			map.removeControl(myStepControl);
			map.clearOverlays();
		};

		//跟踪关键点
		function checkStep() {
			if(map.getDistance(MyPoi, cur_route.getStep(cur_step_index).getPosition()) < 10) {
				cur_step_index++;
				if(cur_step_index == cur_route.getNumSteps()) {
					$("#step").text("已到达终点附近");
					return;
				}
				$("#step").text(cur_route.getStep(cur_step_index).getDescription(false));
				console.log("到达关键点");
			}
			setTimeout(function() {
				checkStep();
			}, 5000);
		}
		
/*地点输入提示*/
	var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
		{"input" : "suggestId"
		,"location" : map
	});

	ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
	var str = "";
		var _value = e.fromitem.value;
		var value = "";
		if (e.fromitem.index > -1) {
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
		
		value = "";
		if (e.toitem.index > -1) {
			_value = e.toitem.value;
			value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		}    
		str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
		G("searchResultPanel").innerHTML = str;
	});

	var myValue;
	ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
	var _value = e.item.value;
		myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
		G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
		
		setPlace();
	});

	function setPlace(){
		/*map.clearOverlays();*/    //清除地图上所有覆盖物
		function myFun(){
			var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
			map.addOverlay(new BMap.Marker(pp));    //添加标注
			var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
			driving.search(point,pp);//规划驾车路线
			console.info(point,pp);
		}
		var local = new BMap.LocalSearch(map, { //智能搜索
		  onSearchComplete: myFun
		});
		local.search(myValue);
	}
/*地点输入提示 end*/