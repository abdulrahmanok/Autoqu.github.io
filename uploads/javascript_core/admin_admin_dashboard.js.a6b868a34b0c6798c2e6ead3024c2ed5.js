ips.templates.set('dashboard.widget',"  <li id='elWidget_{{key}}' data-widgetKey='{{key}}' data-widgetName='{{name}}' data-widgetBy='{{by}}' style='display: none'>  <div class='ipsBox acpWidget_item'>   <h2 class='ipsBox_titleBar ipsType_reset'>    <ul class='ipsList_reset ipsList_inline acpWidget_tools'>     <li>      <a href='#' class='acpWidget_reorder ipsJS_show ipsCursor_drag' data-ipsTooltip title='Reorder widget'><i class='fa fa-bars'></i></a>     </li>     <li>      <a href='#' class='acpWidget_close' data-ipsTooltip title='Close widget'><i class='fa fa-times'></i></a>     </li>    </ul>    {{name}} {{#by}}<span class='ipsType_light ipsType_medium ipsType_unbold'>By {{by}}</span>{{/by}}   </h2>   <div class='ipsPad' data-role='widgetContent'>    {{content}}   </div>  </div> </li>");ips.templates.set('dashboard.menuItem',"  <li class='ipsMenu_item' data-ipsMenuValue='{{key}}' data-widgetName='{{name}}' data-widgetBy='{{by}}'>  <a href='#'>{{name}}</a> </li>");ips.templates.set('newFeatures.card',"  <div class='acpNewFeature_card' data-role='card'>  <img src='{{image}}' class='acpNewFeature_image'>  <div class='acpNewFeature_info'>   <h2 class='acpNewFeature_title'>{{title}}</h2>   <p class='acpNewFeature_desc'>{{description}}</p>   {{#moreInfo}}<a href='{{moreInfo}}' class='acpNewFeature_button ipsButton ipsButton_verySmall ipsButton_primary'>{{#lang}}findOutMore{{/lang}}</a>{{/moreInfo}}  </div> </div>");ips.templates.set('newFeatures.dot',"  <li class='acpNewFeature_dot' data-role='dot'><a href='#' data-dotIdx='{{i}}' data-role='dotFeature'></a></li>");ips.templates.set('newFeatures.wrapper',"  <div class='acpNewFeature' data-role='newFeatures'>  <div class='acpNewFeature_wrap'>   <a href='#' class='acpNewFeature_close' data-action='closeNewFeature' data-ipsTooltip title='{{#lang}}close{{/lang}}'>&times;</a>   <a href='#' class='acpNewFeature_arrow acpNewFeature_next' data-action='nextFeature'><i class='fa fa-angle-right'></i></a>   <a href='#' class='acpNewFeature_arrow acpNewFeature_prev' data-action='prevFeature'><i class='fa fa-angle-left'></i></a>   <div class='acpNewFeature_inner'>    <h1 class='acpNewFeature_mainTitle' data-role='mainTitle'>{{#lang}}whatsNew{{/lang}}</h1>    <div class='acpNewFeature_cardWrap'>     {{{cards}}}    </div>    <ul class='acpNewFeature_dots ipsList_reset' data-role='dots'>     {{{dots}}}    </ul>   </div>  </div> </div>");;
;(function($,_,undefined){"use strict";ips.controller.register('core.admin.dashboard.adminNotes',{initialize:function(){this.on('submit','form',this.saveNotes);},saveNotes:function(e){e.preventDefault();var url=$(e.currentTarget).attr('action');var self=this;this.scope.find('[data-role="notesInfo"]').hide();this.scope.find('[data-role="notesLoading"]').removeClass('ipsHide');ips.getAjax()(url,{type:'post',data:$('#admin_notes').serialize()}).done(function(response){self.scope.find('[data-role="notesInfo"]').html(response);}).fail(function(){}).always(function(){self.scope.find('[data-role="notesInfo"]').show();self.scope.find('[data-role="notesLoading"]').addClass('ipsHide');});}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('core.admin.dashboard.main',{_managing:false,initialize:function(){this.on('click','.acpWidget_close',this.closeWidget);this.on(document,'menuItemSelected','#elAddWidgets:not( .ipsButton_disabled )',this.addWidget);this.on('refreshWidget','[data-widgetKey]',this.refreshWidget);this.setup();},setup:function(){this.mainColumn=this.scope.find('[data-role="mainColumn"]');this.sideColumn=this.scope.find('[data-role="sideColumn"]');this.scope.find('[data-role="sideColumn"]').sortable({handle:'.acpWidget_reorder',forcePlaceholderSize:true,placeholder:'acpWidget_emptyHover',connectWith:'[data-role="mainColumn"]',tolerance:'pointer',containment:'window',start:this.startDrag,stop:_.bind(this.stopDrag,this),update:_.bind(this.update,this)});this.scope.find('[data-role="mainColumn"]').sortable({handle:'.acpWidget_reorder',forcePlaceholderSize:true,placeholder:'acpWidget_emptyHover',connectWith:'[data-role="sideColumn"]',tolerance:'pointer',containment:'window',start:this.startDrag,stop:_.bind(this.stopDrag,this),update:_.bind(this.update,this)});},startDrag:function(){$('body').attr('data-dragging',true).css({overflow:'scroll'});},stopDrag:function(e,ui){$('body').removeAttr('data-dragging').css({overflow:'auto'});$(ui.item).trigger('sorted.dashboard',{ui:ui});this._loadWidget($(ui.item).attr('data-widgetkey'));$('#ipsTooltip').hide();},update:function(){this._savePositions();},closeWidget:function(e){e.preventDefault();var self=this;var widget=$(e.currentTarget).closest('[data-widgetKey]');var key=widget.attr('data-widgetKey');var name=widget.attr('data-widgetName');widget.animationComplete(function(){widget.remove();self.mainColumn.sortable('refresh');self.sideColumn.sortable('refresh');self._savePositions();});widget.animate({height:0});ips.utils.anim.go('zoomOut fast',widget);$('#elAddWidgets_menu').find('[data-ipsMenuValue="'+key+'"]').removeClass('ipsHide');this.scope.find('#elAddWidgets_button').removeClass('ipsButton_disabled').removeAttr('data-disabled');},addWidget:function(e,data){data.originalEvent.preventDefault();var item=data.menuElem.find('[data-ipsMenuValue="'+data.selectedItemID+'"]');var key=item.attr('data-ipsMenuValue');var name=item.attr('data-widgetName');var newWidget=ips.templates.render('dashboard.widget',{key:key,name:name});this.mainColumn.prepend(newWidget);var newWidgetElem=this.mainColumn.find('#elWidget_'+key);ips.utils.anim.go('fadeIn',newWidgetElem);this._loadWidget(key);this._savePositions();setTimeout(function(){item.addClass('ipsHide');},500);if(!data.menuElem.find('[data-ipsMenuValue]:not( .ipsHide ):not( [data-ipsMenuValue="'+data.selectedItemID+'"] )').length){this.scope.find('#elAddWidgets_button').addClass('ipsButton_disabled').attr('data-disabled',true);}},_loadWidget:function(key){var widget=this.scope.find('[data-widgetKey="'+key+'"]');if(!widget.length){return;}
widget.find('[data-role="widgetContent"]').css({height:widget.find('[data-role="widgetContent"]').outerHeight()+'px',}).html('').addClass('ipsLoading');ips.getAjax()('?app=core&module=overview&controller=dashboard&do=getBlock',{data:{appKey:key.substr(0,key.indexOf('_')),blockKey:key}}).done(function(response){widget.find('[data-role="widgetContent"]').css({height:'auto'}).html(response).removeClass('ipsLoading');$(document).trigger('contentChange',[widget]);});},refreshWidget:function(e){var key=$(e.currentTarget).attr('data-widgetKey');this._loadWidget(key);},_savePositions:function(){var main=this.mainColumn.sortable('toArray',{attribute:'data-widgetKey'});var side=this.sideColumn.sortable('toArray',{attribute:'data-widgetKey'});ips.getAjax()('?app=core&module=overview&controller=dashboard&do=update',{data:{blocks:{'main':main,'side':side}}}).done(function(){}).fail(function(){ips.ui.alert.show({type:'alert',icon:'warn',message:ips.getString('dashboard_cant_save'),callbacks:{}});});}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('core.admin.dashboard.newFeatures',{_modal:null,_container:null,_cards:null,_dots:null,_next:null,_prev:null,_data:[],_active:null,_popupActive:false,initialize:function(){this.on(document,'click','[data-action="nextFeature"]',this.next);this.on(document,'click','[data-action="prevFeature"]',this.prev);this.on(document,'click','[data-role="dotFeature"]',this.dot);this.on(document,'click','[data-action="closeNewFeature"]',this.close);this.on(document,'keydown',this.keydown);this.setup();},setup:function(){if(!this.scope.attr('data-newFeatures')){return;}
try{var data=$.parseJSON(this.scope.attr('data-newFeatures'));this._data=data.slice(0,9);}catch(err){Debug.error(err);}
this._buildPopup();this._showPopup();},keydown:function(e){if(!this._popupActive){return;}
switch(event.which){case 27:this.close();break;case 39:this.next();break;case 37:this.prev();break;}},close:function(e){if(e){e.preventDefault();}
this._popupActive=false;this._container.animate({transform:"scale(0.7)",opacity:0},'fast');ips.utils.anim.go('fadeOut',this._modal);},_animate:function(from,to,dir){to.css({transform:dir=='forward'?"translateX(100px)":"translateX(-100px)",opacity:0}).show();this._next.fadeToggle(!to.next().length);this._prev.fadeToggle(!to.prev().length);from.animate({transform:dir=='forward'?"translateX(-100px)":"translateX(100px)",opacity:0},function(){from.hide()});to.animate({transform:"translateX(0)",opacity:1});this._active=this._cards.index(to);this._dots.removeClass('acpNewFeature_active');this._dots.eq(this._active).addClass('acpNewFeature_active');},dot:function(e){if(e){e.preventDefault();}
var dot=$(e.currentTarget).parent();var idx=this._dots.index(dot);Debug.log('idx: '+idx);var current=this._cards.eq(this._active);var next=this._cards.eq(idx);var dir='forward';if(idx<this._active){dir='backward';}
this._animate(current,next,dir);},next:function(e){if(e){e.preventDefault();}
var current=this._cards.eq(this._active);var next=current.next();if(!next.length){Debug.log('no next');return;}
this._animate(current,next,'forward');},prev:function(e){if(e){e.preventDefault();}
var current=this._cards.eq(this._active);var prev=current.prev();if(!prev.length){Debug.log('no prev');return;}
this._animate(current,prev,'backward');},_buildPopup:function(){var cards=[];var dots=[];this._modal=ips.ui.getModal();_.each(this._data,function(item){cards.push(ips.templates.render('newFeatures.card',{title:item.title,image:item.image,description:item.description,moreInfo:item.more_info||false}));});for(var i=0;i<cards.length;i++){dots.push(ips.templates.render('newFeatures.dot',{i:i}));}
var container=ips.templates.render('newFeatures.wrapper',{cards:cards.join(''),dots:dots.join('')});$('body').append(container);this._container=$('body').find('[data-role="newFeatures"]').css({opacity:0.001,transform:"scale(0.8)"});this._cards=this._container.find('[data-role="card"]');this._dots=this._container.find('[data-role="dots"] [data-role="dot"]');this._next=this._container.find('[data-action="nextFeature"]').hide();this._prev=this._container.find('[data-action="prevFeature"]').hide();$(document).trigger('contentChange',[this._container]);this._modal.on('click',this._closeModal.bind(this));},_closeModal:function(e){e.preventDefault();this.close();},_showPopup:function(){var self=this;this._cards.not(':first').hide();this._active=0;this._dots.first().addClass('acpNewFeature_active');if(this._data.length>1){this._next.show();}
this._modal.css({zIndex:ips.ui.zIndex()});ips.utils.anim.go('fadeIn',this._modal);var title=self._container.find('[data-role="mainTitle"]');title.css({transform:"scale(1.2)",opacity:0});this._popupActive=true;setTimeout(function(){self._container.css({zIndex:ips.ui.zIndex()});self._container.animate({opacity:1,transform:"scale(1)"},'fast');},500);setTimeout(function(){title.animate({opacity:1,transform:"scale(1)"},'fast');},800);}});}(jQuery,_));;
;(function($,_,undefined){"use strict";ips.controller.register('core.admin.dashboard.validation',{initialize:function(){this.on('click','[data-action="approve"], [data-action="ban"]',this.validateUser);},validateUser:function(e){e.preventDefault();var self=this;var button=$(e.currentTarget);var url=button.attr('href');var type=button.attr('data-action');var row=button.closest('.ipsDataItem');var name=row.find('[data-role="userName"]').text();var toggles=button.closest('[data-role="validateToggles"]');button.text(type=='approve'?ips.getString('widgetApproving'):ips.getString('widgetBanning')).addClass('ipsButton_disabled');ips.getAjax()(url).done(function(){row.addClass(type=='approve'?'ipsDataItem_success':'ipsDataItem_error');row.attr('data-status','done');button.text(type=='approve'?ips.getString('widgetApproved'):ips.getString('widgetBanned'));setTimeout(function(){ips.utils.anim.go('fadeOut',toggles);},750);ips.ui.flashMsg.show(ips.getString(type=='approve'?'userApproved':'userBanned',{name:name}));self._checkForFinished();});},_checkForFinished:function(e){var items=this.scope.find('[data-role="userAwaitingValidation"]');var doneItems=this.scope.find('[data-status="done"]');var self=this;if(items.length===doneItems.length){setTimeout(function(){self.scope.trigger('refreshWidget');},750);}}});}(jQuery,_));;