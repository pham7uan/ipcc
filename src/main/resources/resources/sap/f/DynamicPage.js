/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/ui/core/ScrollBar","sap/ui/core/ResizeHandler","sap/ui/core/delegate/ScrollEnablement","sap/ui/Device"],function(q,l,C,S,R,a,D){"use strict";var b=C.extend("sap.f.DynamicPage",{metadata:{library:"sap.f",properties:{preserveHeaderStateOnScroll:{type:"boolean",group:"Behavior",defaultValue:false},headerExpanded:{type:"boolean",group:"Behavior",defaultValue:true},toggleHeaderOnTitleClick:{type:"boolean",group:"Behavior",defaultValue:true},showFooter:{type:"boolean",group:"Behavior",defaultValue:false},fitContent:{type:"boolean",group:"Behavior",defaultValue:false}},aggregations:{title:{type:"sap.f.DynamicPageTitle",multiple:false},header:{type:"sap.f.DynamicPageHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false},footer:{type:"sap.m.IBar",multiple:false},_scrollBar:{type:"sap.ui.core.ScrollBar",multiple:false,visibility:"hidden"}}}});function e(o){if(arguments.length===1){return o&&("length"in o)?o.length>0:!!o;}return Array.prototype.slice.call(arguments).every(function(O){return e(O);});}var u=sap.ui.getCore().getConfiguration().getAnimation();b.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE=0.6;b.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE=0.6;b.FOOTER_ANIMATION_DURATION=350;b.BREAK_POINTS={TABLET:1024,PHONE:600};b.EVENTS={TITLE_PRESS:"_titlePress",PIN_UNPIN_PRESS:"_pinUnpinPress"};b.MEDIA={INVISIBLE:"sapUiHidden",PHONE:"sapFDynamicPage-Std-Phone",TABLET:"sapFDynamicPage-Std-Tablet",DESKTOP:"sapFDynamicPage-Std-Desktop"};b.RESIZE_HANDLER_ID={PAGE:"_sResizeHandlerId",TITLE:"_sTitleResizeHandlerId",CONTENT:"_sContentResizeHandlerId"};b.prototype.init=function(){this._bPinned=false;this._bHeaderInTitleArea=false;this._bExpandingWithAClick=false;this._bSuppressToggleHeaderOnce=false;this._headerBiggerThanAllowedHeight=false;this._bMSBrowser=D.browser.internet_explorer||D.browser.edge||false;this._oScrollHelper=new a(this,this.getId()+"-content",{horizontal:false,vertical:true});};b.prototype.onBeforeRendering=function(){if(!this._preserveHeaderStateOnScroll()){this._attachPinPressHandler();}this._attachTitlePressHandler();this._detachScrollHandler();};b.prototype.onAfterRendering=function(){var s;if(this._preserveHeaderStateOnScroll()){q.sap.delayedCall(0,this,this._overridePreserveHeaderStateOnScroll);}this._bPinned=false;this._cacheDomElements();this._detachResizeHandlers();this._attachResizeHandlers();this._updateMedia(this._getWidth(this));this._attachScrollHandler();this._updateScrollBar();this._attachPageChildrenAfterRenderingDelegates();this._resetPinButtonState();if(!this.getHeaderExpanded()){this._snapHeader(false);s=this.getHeader()&&!this.getPreserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();if(s){this._setScrollPosition(this._getSnappingHeight());}else{this._toggleHeaderVisibility(false);this._moveHeaderToTitleArea();}}};b.prototype.exit=function(){this._detachResizeHandlers();if(this._oScrollHelper){this._oScrollHelper.destroy();}};b.prototype.setShowFooter=function(s){var r=this.setProperty("showFooter",s,true);this._toggleFooter(s);return r;};b.prototype.setHeaderExpanded=function(h){if(this._bPinned){return this;}if(this.getHeaderExpanded()===h){return this;}if(this.getDomRef()){this._titleExpandCollapseWhenAllowed();}this.setProperty("headerExpanded",h,true);return this;};b.prototype.setToggleHeaderOnTitleClick=function(t){var r=this.setProperty("toggleHeaderOnTitleClick",t,true);this.$().toggleClass("sapFDynamicPageTitleClickEnabled",t);return r;};b.prototype.setFitContent=function(f){var r=this.setProperty("fitContent",f,true);if(e(this.$())){this._updateFitContainer();}return r;};b.prototype.getScrollDelegate=function(){return this._oScrollHelper;};b.prototype._overridePreserveHeaderStateOnScroll=function(){if(!this._shouldOverridePreserveHeaderStateOnScroll()){this._headerBiggerThanAllowedHeight=false;return;}this._headerBiggerThanAllowedHeight=true;if(this.getHeaderExpanded()){this._moveHeaderToContentArea(true);}else{this._adjustSnap();}this._updateScrollBar();};b.prototype._shouldOverridePreserveHeaderStateOnScroll=function(){return!D.system.desktop&&this._headerBiggerThanAllowedToBeFixed()&&this._preserveHeaderStateOnScroll();};b.prototype._toggleFooter=function(s){var f=this.getFooter();if(!e(this.$())){return;}if(!e(f)){return;}f.toggleStyleClass("sapFDynamicPageActualFooterControlShow",s);f.toggleStyleClass("sapFDynamicPageActualFooterControlHide",!s);this._toggleFooterSpacer(s);if(u){if(!s){q.sap.delayedCall(b.FOOTER_ANIMATION_DURATION,this,function(){this.$footerWrapper.toggleClass("sapUiHidden",!this.getShowFooter());});}else{this.$footerWrapper.toggleClass("sapUiHidden",!this.getShowFooter());}q.sap.delayedCall(b.FOOTER_ANIMATION_DURATION,this,function(){f.removeStyleClass("sapFDynamicPageActualFooterControlShow");});}this._updateScrollBar();};b.prototype._toggleFooterSpacer=function(t){var $=this.$("spacer");if(e($)){$.toggleClass("sapFDynamicPageContentWrapperSpacer",t);}if(e(this.$contentFitContainer)){this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainerFooterVisible",t);}};b.prototype._snapHeader=function(A){var d=this.getTitle();if(this._bPinned){q.sap.log.debug("DynamicPage :: aborted snapping, header is pinned",this);return;}q.sap.log.debug("DynamicPage :: snapped header",this);if(e(d)){if(e(d.getExpandedContent())){d._setShowExpandContent(false);}if(e(d.getSnappedContent())){d._setShowSnapContent(true);}if(A&&this._bHeaderInTitleArea){this._moveHeaderToContentArea(true);}}if(!e(this.$titleArea)){q.sap.log.warning("DynamicPage :: couldn't snap header. There's no title.",this);return;}this.setProperty("headerExpanded",false,true);this.$titleArea.addClass("sapFDynamicPageTitleSnapped");};b.prototype._expandHeader=function(A){var d=this.getTitle();q.sap.log.debug("DynamicPage :: expand header",this);if(e(d)){if(e(d.getExpandedContent())){d._setShowExpandContent(true);}if(e(d.getSnappedContent())){d._setShowSnapContent(false);}if(A){this._moveHeaderToTitleArea(true);}}if(!e(this.$titleArea)){q.sap.log.warning("DynamicPage :: couldn't expand header. There's no title.",this);return;}this.setProperty("headerExpanded",true,true);this.$titleArea.removeClass("sapFDynamicPageTitleSnapped");};b.prototype._toggleHeaderVisibility=function(s){var E=this.getHeaderExpanded(),d=this.getTitle(),o=this.getHeader();if(this._bPinned){q.sap.log.debug("DynamicPage :: header toggle aborted, header is pinned",this);return;}if(e(d)){d._setShowExpandContent(E);d._setShowSnapContent(!E);}if(e(o)){o.$().toggleClass("sapFDynamicPageHeaderHidden",!s);this._updateScrollBar();}};b.prototype._moveHeaderToContentArea=function(o){var d=this.getHeader();if(e(d)){d.$().prependTo(this.$wrapper);this._bHeaderInTitleArea=false;if(o){this._offsetContentOnMoveHeader();}}};b.prototype._moveHeaderToTitleArea=function(o){var d=this.getHeader();if(e(d)){d.$().appendTo(this.$titleArea);this._bHeaderInTitleArea=true;if(o){this._offsetContentOnMoveHeader();}}};b.prototype._offsetContentOnMoveHeader=function(){var o=this.getHeader().$().outerHeight(),c=Math.ceil(this._getScrollPosition()),n;if(!o){return;}n=this._bHeaderInTitleArea?c-o:c+o;n=Math.max(n,0);this._setScrollPosition(n,true);};b.prototype._pin=function(){if(!this._bPinned){this._bPinned=true;if(!this._bHeaderInTitleArea){this._moveHeaderToTitleArea(true);this._updateScrollBar();}this._togglePinButtonARIAState(this._bPinned);}};b.prototype._unPin=function(){if(this._bPinned){this._bPinned=false;this._togglePinButtonARIAState(this._bPinned);}};b.prototype._togglePinButtonVisibility=function(t){var d=this.getHeader();if(e(d)){d._setShowPinBtn(t);}};b.prototype._togglePinButtonPressedState=function(p){var d=this.getHeader();if(e(d)){d._togglePinButton(p);}};b.prototype._togglePinButtonARIAState=function(p){var d=this.getHeader();if(e(d)){d._updateARIAPinButtonState(p);}};b.prototype._resetPinButtonState=function(){if(this._preserveHeaderStateOnScroll()){this._togglePinButtonVisibility(false);}else{this._togglePinButtonPressedState(false);this._togglePinButtonARIAState(false);}};b.prototype._restorePinButtonFocus=function(){this.getHeader()._focusPinButton();};b.prototype._getScrollPosition=function(){return e(this.$wrapper)?this.$wrapper.scrollTop():0;};b.prototype._setScrollPosition=function(n,s){if(!e(this.$wrapper)){return;}if(this._getScrollPosition()===n){return;}if(s){this._bSuppressToggleHeaderOnce=true;}if(!this.getScrollDelegate()._$Container){this.getScrollDelegate()._$Container=this.$wrapper;}this.getScrollDelegate().scrollTo(0,n);};b.prototype._shouldSnap=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()>=this._getSnappingHeight()&&this.getHeaderExpanded()&&!this._bPinned;};b.prototype._shouldExpand=function(){return!this._preserveHeaderStateOnScroll()&&this._getScrollPosition()<this._getSnappingHeight()&&!this.getHeaderExpanded()&&!this._bPinned;};b.prototype._headerScrolledOut=function(){return this._getScrollPosition()>=this._getSnappingHeight();};b.prototype._headerSnapAllowed=function(){return!this._preserveHeaderStateOnScroll()&&this.getHeaderExpanded()&&!this._bPinned;};b.prototype._canSnapHeaderOnScroll=function(){var m=this._getMaxScrollPosition(),t=this._bMSBrowser?1:0;if(this._bHeaderInTitleArea){m+=this._getHeaderHeight();m-=t;}return m>this._getSnappingHeight();};b.prototype._getSnappingHeight=function(){return this._getHeaderHeight()||this._getTitleHeight();};b.prototype._getMaxScrollPosition=function(){var $;if(e(this.$wrapper)){$=this.$wrapper[0];return $.scrollHeight-$.clientHeight;}return 0;};b.prototype._needsVerticalScrollBar=function(){var t=this._bMSBrowser?1:0;return this._getMaxScrollPosition()>t;};b.prototype._getOwnHeight=function(){return this._getHeight(this);};b.prototype._getEntireHeaderHeight=function(){var t=0,h=0,d=this.getTitle(),o=this.getHeader();if(e(d)){t=d.$().outerHeight();}if(e(o)){h=o.$().outerHeight();}return t+h;};b.prototype._headerBiggerThanAllowedToPin=function(c){if(!(typeof c==="number"&&!isNaN(parseInt(c,10)))){c=this._getOwnHeight();}return this._getEntireHeaderHeight()>b.HEADER_MAX_ALLOWED_PINNED_PERCENTAGE*c;};b.prototype._headerBiggerThanAllowedToBeFixed=function(){var c=this._getOwnHeight();return this._getEntireHeaderHeight()>b.HEADER_MAX_ALLOWED_NON_SROLLABLE_PERCENTAGE*c;};b.prototype._measureScrollBarOffsetHeight=function(){var h=0,s=!this.getHeaderExpanded(),H=this._bHeaderInTitleArea;if(this._preserveHeaderStateOnScroll()||this._bPinned||(!s&&this._bHeaderInTitleArea)){h=this._getTitleAreaHeight();q.sap.log.debug("DynamicPage :: preserveHeaderState is enabled or header pinned :: title area height"+h,this);return h;}if(s||!e(this.getTitle())||!this._canSnapHeaderOnScroll()){h=this._getTitleHeight();q.sap.log.debug("DynamicPage :: header snapped :: title height "+h,this);return h;}this._snapHeader(true);h=this._getTitleHeight();if(!s){this._expandHeader(H);}q.sap.log.debug("DynamicPage :: snapped mode :: title height "+h,this);return h;};b.prototype._updateScrollBar=function(){var s,c,n;if(!D.system.desktop||!e(this.$wrapper)){return;}s=this._getScrollBar();s.setContentSize(this._measureScrollBarOffsetHeight()+this.$wrapper[0].scrollHeight+"px");c=this._needsVerticalScrollBar();n=this.bHasScrollbar!==c;if(n){s.toggleStyleClass("sapUiHidden",!c);this.toggleStyleClass("sapFDynamicPageWithScroll",c);this.bHasScrollbar=c;q.sap.delayedCall(0,this,this._updateFitContainer);}q.sap.delayedCall(0,this,this._updateScrollBarOffset);};b.prototype._updateFitContainer=function(n){var N=typeof n!=='undefined'?!n:!this._needsVerticalScrollBar(),f=this.getFitContent(),t=f||N;this.$contentFitContainer.toggleClass("sapFDynamicPageContentFitContainer",t);};b.prototype._updateScrollBarOffset=function(){var s=sap.ui.getCore().getConfiguration().getRTL()?"left":"right",o=this._needsVerticalScrollBar()?q.sap.scrollbarSize().width+"px":0,f=this.getFooter();this.$titleArea.css("padding-"+s,o);if(e(f)){f.$().css(s,o);}};b.prototype._updateHeaderARIAState=function(E){var d=this.getHeader();if(e(d)){d._updateARIAState(E);}};b.prototype._updateMedia=function(w){if(w===0){this._updateMediaStyle(b.MEDIA.INVISIBLE);}else if(w<=b.BREAK_POINTS.PHONE){this._updateMediaStyle(b.MEDIA.PHONE);}else if(w<=b.BREAK_POINTS.TABLET){this._updateMediaStyle(b.MEDIA.TABLET);}else{this._updateMediaStyle(b.MEDIA.DESKTOP);}};b.prototype._updateMediaStyle=function(c){Object.keys(b.MEDIA).forEach(function(m){var E=c===b.MEDIA[m];this.toggleStyleClass(b.MEDIA[m],E);},this);};b.prototype._getHeight=function(c){return!(c instanceof C)?0:c.$().outerHeight()||0;};b.prototype._getWidth=function(c){return!(c instanceof C)?0:c.$().outerWidth()||0;};b.prototype._getTitleAreaHeight=function(){return e(this.$titleArea)?this.$titleArea.outerHeight()||0:0;};b.prototype._getTitleHeight=function(){return this._getHeight(this.getTitle());};b.prototype._getHeaderHeight=function(){return this._getHeight(this.getHeader());};b.prototype._preserveHeaderStateOnScroll=function(){return this.getPreserveHeaderStateOnScroll()&&!this._headerBiggerThanAllowedHeight;};b.prototype._getScrollBar=function(){if(!e(this.getAggregation("_scrollBar"))){var v=new S(this.getId()+"-vertSB",{vertical:true,size:"100%",scrollPosition:0,scroll:this._onScrollBarScroll.bind(this)});this.setAggregation("_scrollBar",v,true);}return this.getAggregation("_scrollBar");};b.prototype._cacheDomElements=function(){var f=this.getFooter();if(e(f)){this.$footer=f.$();this.$footerWrapper=this.$("footerWrapper");}this.$wrapper=this.$("contentWrapper");this.$contentFitContainer=this.$("contentFitContainer");this.$titleArea=this.$("header");this._cacheTitleDom();};b.prototype._cacheTitleDom=function(){var t=this.getTitle();if(e(t)){this.$title=t.$();}};b.prototype._adjustSnap=function(){var d=this.getHeader(),i=!this.getHeaderExpanded(),c,I;if(!d||!i){return;}c=!this._preserveHeaderStateOnScroll()&&this._canSnapHeaderOnScroll();I=i&&d.$().hasClass("sapFDynamicPageHeaderHidden");if(c&&I){this._toggleHeaderVisibility(true);this._moveHeaderToContentArea(true);}else if(!c&&!I){this._moveHeaderToTitleArea(true);this._toggleHeaderVisibility(false);}};b.prototype.ontouchmove=function(E){E.setMarked();};b.prototype._onChildControlAfterRendering=function(E){if(E.srcControl instanceof sap.f.DynamicPageTitle){this._cacheTitleDom();this._deRegisterResizeHandler(b.RESIZE_HANDLER_ID.TITLE);this._registerResizeHandler(b.RESIZE_HANDLER_ID.TITLE,this.$title[0],this._onChildControlsHeightChange.bind(this));}q.sap.delayedCall(0,this,this._updateScrollBar);};b.prototype._onChildControlsHeightChange=function(E){var n=this._needsVerticalScrollBar();if(n){this._updateFitContainer(n);}this._adjustSnap();if(!this._bExpandingWithAClick){this._updateScrollBar();}this._bExpandingWithAClick=false;};b.prototype._onResize=function(E){var d=this.getHeader();if(!this._preserveHeaderStateOnScroll()&&d){if(this._headerBiggerThanAllowedToPin(E.size.height)||D.system.phone){this._unPin();this._togglePinButtonVisibility(false);this._togglePinButtonPressedState(false);}else{this._togglePinButtonVisibility(true);}}this._adjustSnap();this._updateScrollBar();this._updateMedia(E.size.width);};b.prototype._onWrapperScroll=function(E){var s=Math.max(E.target.scrollTop,0);if(D.system.desktop){if(this.allowCustomScroll===true){this.allowCustomScroll=false;return;}this.allowInnerDiv=true;this._getScrollBar().setScrollPosition(s);this.toggleStyleClass("sapFDynamicPageWithScroll",this._needsVerticalScrollBar());}};b.prototype._toggleHeaderOnScroll=function(){if(this._bSuppressToggleHeaderOnce){this._bSuppressToggleHeaderOnce=false;return;}if(D.system.desktop&&this._bExpandingWithAClick){return;}if(this._preserveHeaderStateOnScroll()){return;}if(this._shouldSnap()){this._snapHeader(true);this._updateHeaderARIAState(false);}else if(this._shouldExpand()){this._expandHeader();this._toggleHeaderVisibility(true);this._updateHeaderARIAState(true);}else if(!this._bPinned&&this._bHeaderInTitleArea){var d=(this._getScrollPosition()>=this._getSnappingHeight());this._moveHeaderToContentArea(d);}};b.prototype._onScrollBarScroll=function(){if(this.allowInnerDiv===true){this.allowInnerDiv=false;return;}this.allowCustomScroll=true;this._setScrollPosition(this._getScrollBar().getScrollPosition());};b.prototype._onTitlePress=function(){if(this.getToggleHeaderOnTitleClick()){this._titleExpandCollapseWhenAllowed();}};b.prototype._titleExpandCollapseWhenAllowed=function(){if(this._bPinned){return this;}if(this._preserveHeaderStateOnScroll()||!this._canSnapHeaderOnScroll()||!this.getHeader()){if(!this.getHeaderExpanded()){this._expandHeader(false);this._toggleHeaderVisibility(true);}else{this._snapHeader(false);this._toggleHeaderVisibility(false);}}else if(!this.getHeaderExpanded()){this._bExpandingWithAClick=true;this._expandHeader(true);this._bExpandingWithAClick=false;}else{var m=this._bHeaderInTitleArea;this._snapHeader(m);if(!m){this._setScrollPosition(this._getSnappingHeight());}}};b.prototype._onPinUnpinButtonPress=function(E){if(this._bPinned){this._unPin(E);}else{this._pin(E);this._restorePinButtonFocus();}};b.prototype._attachResizeHandlers=function(){var c=this._onChildControlsHeightChange.bind(this);this._registerResizeHandler(b.RESIZE_HANDLER_ID.PAGE,this,this._onResize.bind(this));if(e(this.$title)){this._registerResizeHandler(b.RESIZE_HANDLER_ID.TITLE,this.$title[0],c);}if(e(this.$contentFitContainer)){this._registerResizeHandler(b.RESIZE_HANDLER_ID.CONTENT,this.$contentFitContainer[0],c);}};b.prototype._registerResizeHandler=function(h,o,H){if(!this[h]){this[h]=R.register(o,H);}};b.prototype._detachResizeHandlers=function(){this._deRegisterResizeHandler(b.RESIZE_HANDLER_ID.PAGE);this._deRegisterResizeHandler(b.RESIZE_HANDLER_ID.TITLE);this._deRegisterResizeHandler(b.RESIZE_HANDLER_ID.CONTENT);};b.prototype._deRegisterResizeHandler=function(h){if(this[h]){R.deregister(this[h]);this[h]=null;}};b.prototype._attachPageChildrenAfterRenderingDelegates=function(){var t=this.getTitle(),c=this.getContent(),p={onAfterRendering:this._onChildControlAfterRendering.bind(this)};if(e(t)){t.addEventDelegate(p);}if(e(c)){c.addEventDelegate(p);}};b.prototype._attachTitlePressHandler=function(){var t=this.getTitle();if(e(t)&&!this._bAlreadyAttachedTitlePressHandler){t.attachEvent(b.EVENTS.TITLE_PRESS,this._onTitlePress,this);this._bAlreadyAttachedTitlePressHandler=true;}};b.prototype._attachPinPressHandler=function(){var h=this.getHeader();if(e(h)&&!this._bAlreadyAttachedPinPressHandler){h.attachEvent(b.EVENTS.PIN_UNPIN_PRESS,this._onPinUnpinButtonPress,this);this._bAlreadyAttachedPinPressHandler=true;}};b.prototype._attachScrollHandler=function(){this.$wrapper.on("scroll",this._onWrapperScroll.bind(this));this.$wrapper.on("scroll",this._toggleHeaderOnScroll.bind(this));};b.prototype._detachScrollHandler=function(){if(this.$wrapper){this.$wrapper.unbind("scroll");}};return b;},true);
