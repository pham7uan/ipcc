/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/core/theming/Parameters','sap/ui/Device','./library','./TableUtils','sap/ui/core/Renderer','sap/ui/core/IconPool'],function(q,C,P,D,a,T,R,I){"use strict";var S=a.SelectionMode,V=a.VisibleRowCountMode;var b={};b.render=function(r,t){delete t._iHeaderRowCount;r.write("<div");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"ROOT");r.writeControlData(t);r.addClass("sapUiTable");if('ontouchstart'in document){r.addClass("sapUiTableTouch");}r.addClass("sapUiTableSelMode"+t.getSelectionMode());if(t.getColumnHeaderVisible()){r.addClass("sapUiTableCHdr");}if(T.hasRowHeader(t)){r.addClass("sapUiTableRowSelectors");}if(T.hasRowHighlights(t)){r.addClass("sapUiTableRowHighlights");}var s=a.TableHelper.addTableClass();if(s){r.addClass(s);}if(t._isVSbRequired()){r.addClass("sapUiTableVScr");}if(t.getEditable()){r.addClass("sapUiTableEdt");}if(T.hasRowActions(t)){var i=T.getRowActionCount(t);r.addClass(i==1?"sapUiTableRActS":"sapUiTableRAct");}if(T.isNoDataVisible(t)&&!T.hasPendingRequest(t)){r.addClass("sapUiTableEmpty");}if(t.getShowOverlay()){r.addClass("sapUiTableOverlay");}var m=T.Grouping.getModeCssClass(t);if(m){r.addClass(m);}if(t.getWidth()){r.addStyle("width",t.getWidth());}if(t.getVisibleRowCountMode()==V.Auto){r.addStyle("height","0px");if(t._bFirstRendering){r.addClass("sapUiTableNoOpacity");}}r.writeClasses();r.writeStyles();r.write(">");this.renderTabElement(r,"sapUiTableOuterBefore");if(t.getTitle()){this.renderHeader(r,t,t.getTitle());}if(t.getToolbar()){this.renderToolbar(r,t,t.getToolbar());}if(t.getExtension()&&t.getExtension().length>0){this.renderExtensions(r,t,t.getExtension());}r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableCnt");r.addClass("sapUiTableCnt");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"CONTENT");r.writeAttribute("data-sap-ui-fastnavgroup","true");r.write(">");this.renderColRsz(r,t);this.renderColHdr(r,t);this.renderTable(r,t);t._getAccRenderExtension().writeHiddenAccTexts(r,t);r.write("<div");r.addClass("sapUiTableOverlayArea");r.writeClasses();r.writeAttribute("tabindex","0");r.writeAttribute("id",t.getId()+"-overlay");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"OVERLAY");r.write("></div>");r.write("</div>");if(t.getFooter()){this.renderFooter(r,t,t.getFooter());}if(t.getVisibleRowCountMode()==V.Interactive){this.renderVariableHeight(r,t);}this.renderTabElement(r,"sapUiTableOuterAfter");r.write("</div>");};b.renderHeader=function(r,t,o){r.write("<div");r.addClass("sapUiTableHdr");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TABLEHEADER");r.write(">");r.renderControl(o);r.write("</div>");};b.renderToolbar=function(r,t,o){r.write("<div");r.addClass("sapUiTableTbr");if(typeof o.getStandalone!=="function"){r.addClass("sapUiTableMTbr");}r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TABLESUBHEADER");r.write(">");if(typeof o.getStandalone==="function"&&o.getStandalone()){o.setStandalone(false);}if(T.isInstanceOf(o,"sap/m/Toolbar")){o.setDesign(P.get("_sap_ui_table_Table_ToolbarDesign"),true);}r.renderControl(o);r.write("</div>");};b.renderExtensions=function(r,t,e){for(var i=0,l=e.length;i<l;i++){this.renderExtension(r,t,e[i]);}};b.renderExtension=function(r,t,e){r.write("<div");r.addClass("sapUiTableExt");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TABLESUBHEADER");r.write(">");r.renderControl(e);r.write("</div>");};b.renderTable=function(r,t){r.write("<div");r.writeAttribute("id",t.getId()+"-tableCCnt");r.addClass("sapUiTableCCnt");r.writeClasses();r.write(">");this.renderTableCCnt(r,t);r.write("</div>");this.renderVSb(r,t);this.renderHSb(r,t);};b.renderTableCCnt=function(r,t){this.renderTabElement(r,"sapUiTableCtrlBefore");this.renderTableCtrl(r,t);this.renderRowHdr(r,t);this.renderRowActions(r,t);this.renderTabElement(r,"sapUiTableCtrlAfter");r.write("<div");r.addClass("sapUiTableCtrlEmpty");r.writeClasses();r.writeAttribute("tabindex","0");r.writeAttribute("id",t.getId()+"-noDataCnt");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"NODATA");r.write(">");if(t.getNoData()instanceof C){r.renderControl(t.getNoData());}else{r.write("<span");r.writeAttribute("id",t.getId()+"-noDataMsg");r.addClass("sapUiTableCtrlEmptyMsg");r.writeClasses();r.write(">");r.writeEscaped(T.getNoDataText(t));r.write("</span>");}r.write("</div>");};b.renderFooter=function(r,t,f){r.write("<div");r.addClass("sapUiTableFtr");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TABLEFOOTER");r.write(">");r.renderControl(f);r.write("</div>");};b.renderVariableHeight=function(r,t){r.write('<div id="'+t.getId()+'-sb" tabIndex="-1"');r.addClass("sapUiTableHeightResizer");r.addStyle("height","5px");r.writeClasses();r.writeStyles();r.write(">");r.write("</div>");};b.renderColHdr=function(r,t){var n=T.getHeaderRowCount(t);var c=t.getColumns();var f=t.getFixedColumnCount();r.write("<div");r.addClass("sapUiTableColHdrCnt");r.writeClasses();if(t.getColumnHeaderHeight()>0){r.addStyle("height",(t.getColumnHeaderHeight()*n)+"px");}r.writeStyles();r.write(">");this.renderColRowHdr(r,t);if(f>0){r.write("<div");r.addClass("sapUiTableCHA");r.addClass("sapUiTableCtrlScrFixed");r.addClass("sapUiTableNoOpacity");r.writeClasses();r.write(">");this.renderTableControlCnt(r,t,true,0,f,true,false,0,n,true);r.write("</div>");}r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableColHdrScr");r.addClass("sapUiTableCHA");r.addClass("sapUiTableCtrlScr");if(c.length==0){r.addClass("sapUiTableHasNoColumns");}r.writeClasses();if(f>0){if(t._bRtlMode){r.addStyle("margin-right","0");}else{r.addStyle("margin-left","0");}r.writeStyles();}r.write(">");this.renderTableControlCnt(r,t,false,f,c.length,false,false,0,n,true);r.write("</div>");if(T.hasRowActions(t)){r.write("<div class='sapUiTableRowActionHeader' id='"+t.getId()+"-rowacthdr'");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"ROWACTIONHEADER");r.write("><span>");r.writeEscaped(t._oResBundle.getText("TBL_ROW_ACTION_COLUMN_LABEL"));r.write("</span></div>");}r.write("</div>");};b.renderColRowHdr=function(r,t){var e=false;var s=false;r.write("<div");r.writeAttribute("id",t.getId()+"-selall");if(T.hasSelectAll(t)){var A=T.areAllRowsSelected(t);if(t._getShowStandardTooltips()){var c=A?"TBL_DESELECT_ALL":"TBL_SELECT_ALL";r.writeAttributeEscaped("title",t._oResBundle.getText(c));}if(!A){r.addClass("sapUiTableSelAll");}else{s=true;}r.addClass("sapUiTableSelAllEnabled");e=true;}else{r.addClass("sapUiTableSelAllDisabled");}r.addClass("sapUiTableColRowHdr");r.writeClasses();r.writeAttribute("tabindex","-1");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"COLUMNROWHEADER",{enabled:e,checked:s});r.write(">");if(t.getSelectionMode()!==S.Single){r.write("<div");r.addClass("sapUiTableColRowHdrIco");r.writeClasses();if(t.getColumnHeaderHeight()>0){r.addStyle("height",t.getColumnHeaderHeight()+"px");}r.write(">");r.write("</div>");}r.write("</div>");};b.renderCol=function(r,t,c,h,n,l){var L,i=!n,d=c.getIndex(),e=c.getMultiLabels();if(e.length>0){L=e[h];}else if(h==0){L=c.getLabel();}r.write("<td");var H=c.getId();if(h===0){r.writeElementData(c);}else{H=H+"_"+h;r.writeAttribute('id',H);}r.writeAttribute('data-sap-ui-colid',c.getId());r.writeAttribute("data-sap-ui-colindex",d);r.writeAttribute("tabindex","-1");if(n>1){r.writeAttribute("colspan",n);}t._getAccRenderExtension().writeAriaAttributesFor(r,t,"COLUMNHEADER",{column:c,headerId:H,index:d});r.addClass("sapUiTableCol");if(l){r.addClass("sapUiTableColLastFixed");}r.writeClasses();if(t.getColumnHeaderHeight()>0){r.addStyle("height",t.getColumnHeaderHeight()+"px");}if(i){r.addStyle("display","none");}r.writeStyles();var s=c.getTooltip_AsString();if(s){r.writeAttributeEscaped("title",s);}r.write("><div");r.addClass("sapUiTableColCell");r.writeAttribute("id",H+"-inner");r.writeClasses();var f=R.getTextAlign(c.getHAlign(),L&&L.getTextDirection&&L.getTextDirection());if(f){r.addStyle("text-align",f);}r.writeStyles();r.write(">");if(L){r.renderControl(L);}r.write("</div></td>");};b.renderColRsz=function(r,t){r.write("<div");r.writeAttribute("id",t.getId()+"-rsz");r.addClass("sapUiTableColRsz");r.writeClasses();r.write("></div>");};b.renderRowHdr=function(r,t){r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableRowHdrScr");r.addClass("sapUiTableRowHdrScr");r.addClass("sapUiTableNoOpacity");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"ROWHEADER_COL");r.write(">");for(var c=0,d=t.getRows().length;c<d;c++){this.renderRowAddon(r,t,t.getRows()[c],c,true);}r.write("</div>");};b.renderRowActions=function(r,t){if(!T.hasRowActions(t)){return;}r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableRowActionScr");r.addClass("sapUiTableRowActionScr");r.addClass("sapUiTableNoOpacity");r.writeClasses();r.write(">");for(var c=0,d=t.getRows().length;c<d;c++){this.renderRowAddon(r,t,t.getRows()[c],c,false);}r.write("</div>");};b._addFixedRowCSSClasses=function(r,t,i){var f=t.getFixedRowCount();var F=T.getFirstFixedButtomRowIndex(t);if(f>0){if(i<f){r.addClass("sapUiTableFixedTopRow");}if(i==f-1){r.addClass("sapUiTableFixedLastTopRow");}}if(F>=0&&F===i){r.addClass("sapUiTableFixedFirstBottomRow");}else if(F>=1&&F-1===i){r.addClass("sapUiTableFixedPreBottomRow");}};b.renderRowAddon=function(r,t,o,i,h){r.write("<div");r.writeAttribute("id",t.getId()+(h?"-rowsel":"-rowact")+i);r.writeAttribute("data-sap-ui-rowindex",i);r.addClass(h?"sapUiTableRowHdr":"sapUiTableRowAction");this._addFixedRowCSSClasses(r,t,i);var c=false;var d=false;if(o._bHidden){r.addClass("sapUiTableRowHidden");d=true;}else{if(t.isIndexSelected(o.getIndex())){r.addClass("sapUiTableRowSel");c=true;}}r.writeClasses();if(t.getRowHeight()>0){r.addStyle("height",t.getRowHeight()+"px");}r.writeAttribute("tabindex","-1");t._getAccRenderExtension().writeAriaAttributesFor(r,t,h?"ROWHEADER":"ROWACTION",{rowSelected:c,rowHidden:d});r.writeStyles();r.write(">");if(h){this.writeRowHighlightContent(r,t,o,i);this.writeRowSelectorContent(r,t,o,i);}else{var A=o.getAggregation("_rowAction");if(A){r.renderControl(A);}}r.write("</div>");};b.renderTableCtrl=function(r,t){if(t.getFixedColumnCount()>0){r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableCtrlScrFixed");r.addClass("sapUiTableCtrlScrFixed");r.writeClasses();r.write(">");this.renderTableControl(r,t,true);r.write("</div>");}r.write("<div");r.writeAttribute("id",t.getId()+"-sapUiTableCtrlScr");r.addClass("sapUiTableCtrlScr");r.writeClasses();if(t.getFixedColumnCount()>0){if(t._bRtlMode){r.addStyle("margin-right","0");}else{r.addStyle("margin-left","0");}r.writeStyles();}r.write(">");r.write("<div");r.writeAttribute("id",t.getId()+"-tableCtrlCnt");r.addClass("sapUiTableCtrlCnt");r.writeClasses();var v=t.getVisibleRowCountMode();if(t._iTableRowContentHeight&&(v==V.Fixed||v==V.Interactive)){var s="height";if(t.getVisibleRowCountMode()==V.Fixed){s="min-height";}r.addStyle(s,t._iTableRowContentHeight+"px");r.writeStyles();}r.write(">");this.renderTableControl(r,t,false);r.write("</div></div>");};b.renderTableControl=function(r,t,f){var s,e;if(f){s=0;e=t.getFixedColumnCount();}else{s=t.getFixedColumnCount();e=t.getColumns().length;}var F=t.getFixedRowCount();var i=t.getFixedBottomRowCount();var c=t.getRows();if(F>0){this.renderTableControlCnt(r,t,f,s,e,true,false,0,F);}this.renderTableControlCnt(r,t,f,s,e,false,false,F,c.length-i);if(i>0&&c.length>0){this.renderTableControlCnt(r,t,f,s,e,false,true,c.length-i,c.length);}};b.renderTableControlCnt=function(r,t,f,s,e,F,c,i,E,h){r.write("<table");var d=h?"-header":"-table";var g=t.getId()+d;if(f){g+="-fixed";r.addClass("sapUiTableCtrlFixed");}else{r.addClass("sapUiTableCtrlScroll");}if(F){g+="-fixrow";r.addClass("sapUiTableCtrlRowFixed");}else if(c){g+="-fixrow-bottom";r.addClass("sapUiTableCtrlRowFixedBottom");}else{r.addClass("sapUiTableCtrlRowScroll");}r.writeAttribute("id",g);t._getAccRenderExtension().writeAriaAttributesFor(r,t,h?"COLUMNHEADER_TABLE":"TABLE");r.addClass("sapUiTableCtrl");if(h){r.addClass("sapUiTableCHT");}r.writeClasses();r.addStyle("min-width",t._getColumnsWidth(s,e)+"px");if(f&&(!!D.browser.firefox||!!D.browser.chrome||!!D.browser.safari)){r.addStyle("width",t._getColumnsWidth(s,e)+"px");}r.writeStyles();r.write(">");r.write("<thead>");r.write("<tr");r.addClass("sapUiTableCtrlCol");if(i==0){r.addClass("sapUiTableCtrlFirstCol");}if(h){r.addClass("sapUiTableCHTHR");}r.writeClasses();r.write(">");var j=t.getColumns();var k=new Array(e);var l;var o;var H=false;var m=!f&&e>s;for(l=s;l<e;l++){o=j[l];var n={shouldRender:!!(o&&o.shouldRender())};if(n.shouldRender){var w=o.getWidth();if(T.isVariableWidth(w)){m=false;if(f){w=(o._iFixWidth||160)+"px";}else if(w&&w.indexOf("%")>0){H=true;}}n.width=w;}k[l]=n;}if(T.hasRowHeader(t)&&!h){r.write("<th");if(H){r.addStyle("width","0%");}else{r.addStyle("width","0px");}r.writeStyles();if(i==0){t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TH");if(!h){r.writeAttribute("id",t.getId()+"-colsel");}r.addClass("sapUiTableColSel");r.writeClasses();}r.write("></th>");}else{if(j.length===0){r.write("<th></th>");}}for(l=s;l<e;l++){d=h?"_hdr":"_col";o=j[l];n=k[l];if(n.shouldRender){r.write("<th");if(n.width){r.addStyle("width",n.width);r.writeStyles();}if(i==0){t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TH",{column:o});r.writeAttribute("id",t.getId()+d+l);}r.writeAttribute("data-sap-ui-headcolindex",l);r.writeAttribute("data-sap-ui-colid",o.getId());r.write(">");if(i==0&&T.getHeaderRowCount(t)==0&&!h){if(o.getMultiLabels().length>0){r.renderControl(o.getMultiLabels()[0]);}else{r.renderControl(o.getLabel());}}r.write("</th>");}}if(m){r.write("<th");if(h){r.writeAttribute("id",t.getId()+"-dummycolhdr");}t._getAccRenderExtension().writeAriaAttributesFor(r,t,"PRESENTATION");r.write("></th>");}r.write("</tr>");r.write("</thead>");r.write("<tbody>");var v=t._getVisibleColumns();var p=t.getRows();var u;var x;if(h){for(u=i,x=E;u<x;u++){this.renderColumnHeaderRow(r,t,u,f,s,e,m);}}else{var y=t._getAccExtension().getAriaTextsForSelectionMode(true);var z=T.isRowSelectionAllowed(t);for(u=i,x=E;u<x;u++){this.renderTableRow(r,t,p[u],u,f,s,e,false,v,m,y,z);}}r.write("</tbody>");r.write("</table>");};b.addTrClasses=function(r,t,o,i){return;};b.writeRowSelectorContent=function(r,t,o,i){t._getAccRenderExtension().writeAccRowSelectorText(r,t,o,i);if(T.Grouping.isGroupMode(t)){r.write("<div");r.writeAttribute("class","sapUiTableGroupShield");r.write("></div>");r.write("<div");r.writeAttribute("id",o.getId()+"-groupHeader");r.writeAttribute("class","sapUiTableGroupIcon");r.write("></div>");if(T.Grouping.showGroupMenuButton(t)){var c=I.getIconInfo("sap-icon://drop-down-list");r.write("<div class='sapUiTableGroupMenuButton'>");r.writeEscaped(c.content);r.write("</div>");}}};b.writeRowHighlightContent=function(r,t,o,i){if(!T.hasRowHighlights(t)){return;}var c=o.getAggregation("_settings");var h=c._getHighlightCSSClassName();r.write("<div");r.writeAttribute("id",o.getId()+"-highlight");r.addClass("sapUiTableRowHighlight");r.addClass(h);r.writeClasses();r.write(">");t._getAccRenderExtension().writeAccRowHighlightText(r,t,o,i);r.write("</div>");};b.renderColumnHeaderRow=function(r,t,i,f,s,e,h){r.write("<tr");r.addClass("sapUiTableColHdrTr");r.writeClasses();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"COLUMNHEADER_ROW");r.write(">");var c,n=0,l=-1;c=t.getColumns().slice(s,e).filter(function(o){return!!o&&o.shouldRender();});function d(o,j,k){var m=T.Column.getHeaderSpan(o,i),p;if(n<1){if(m>1){p=o.getIndex();m=k.slice(j+1,j+m).reduce(function(u,v){return v.getIndex()-p<m?u+1:u;},1);}o._nSpan=n=m;l=j;}else{o._nSpan=0;}n--;}c.forEach(d);function g(o,j){this.renderCol(r,t,o,i,o._nSpan,f&&(j==l));o._nSpan=undefined;}c.forEach(g.bind(this));if(!f&&h&&c.length>0){r.write('<td class="sapUiTableTDDummy"');t._getAccRenderExtension().writeAriaAttributesFor(r,t,"PRESENTATION");r.write('></td>');}r.write("</tr>");};b.renderTableRow=function(r,t,o,i,f,s,e,F,v,h,m,c){if(!o){return;}r.write("<tr");if(o._bDummyRow){r.addStyle("opacity","0");}r.addClass("sapUiTableTr");if(f){r.writeAttribute("id",o.getId()+"-fixed");}else{r.writeElementData(o);}if(o._bHidden){r.addClass("sapUiTableRowHidden");}else{if(t.isIndexSelected(o.getIndex())){r.addClass("sapUiTableRowSel");}this.addTrClasses(r,t,o,i);}if(i%2===0){r.addClass("sapUiTableRowEven");}else{r.addClass("sapUiTableRowOdd");}var d=t.getRows();var g=d.length;if(g>0&&d[g-1]===o){r.addClass("sapUiTableLastRow");}else if(g>0&&d[0]===o){r.addClass("sapUiTableFirstRow");}this._addFixedRowCSSClasses(r,t,i);r.writeClasses();r.writeAttribute("data-sap-ui-rowindex",i);var j=t.getRowHeight();if(j>0){r.addStyle("height",j+"px");}r.writeStyles();t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TR",{index:i});r.write(">");var k=o.getCells();if(T.hasRowHeader(t)||k.length===0){r.write("<td");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"ROWHEADER_TD",{rowSelected:!o._bHidden&&t.isIndexSelected(o.getIndex()),index:i});r.write("></td>");}for(var l=0,n=k.length;l<n;l++){this.renderTableCell(r,t,o,k[l],l,f,s,e,v);}if(!f&&h&&k.length>0){r.write('<td class="sapUiTableTDDummy"');t._getAccRenderExtension().writeAriaAttributesFor(r,t,"PRESENTATION");r.write('></td>');}r.write("</tr>");};b.renderTableCell=function(r,t,o,c,i,f,s,e,v){var d=c.data("sap-ui-colindex");var g=t.getColumns()[d];if(g.shouldRender()&&s<=d&&e>d){r.write("<td");var h=o.getId()+"-col"+i;r.writeAttribute("id",h);r.writeAttribute("tabindex","-1");r.writeAttribute("data-sap-ui-colid",g.getId());var n=v.length;var j=n>0&&v[0]===g;var k=n>0&&v[n-1]===g;t._getAccRenderExtension().writeAriaAttributesFor(r,t,"DATACELL",{index:d,column:g,row:o,fixed:f,firstCol:j});var H=R.getTextAlign(g.getHAlign(),c&&c.getTextDirection&&c.getTextDirection());if(H){r.addStyle("text-align",H);}r.writeStyles();r.addClass("sapUiTableTd");if(j){r.addClass("sapUiTableTdFirst");}if(k){r.addClass("sapUiTableTdLast");}if(g.getGrouped()){r.addClass("sapUiTableTdGroup");}var B=t.getBinding("rows");if(B&&g.getLeadingProperty&&B.isMeasure(g.getLeadingProperty())){r.addClass("sapUiTableMeasureCell");}r.writeClasses();r.write("><div");r.addClass("sapUiTableCell");if(j&&T.Grouping.isTreeMode(t)){r.addClass("sapUiTableCellFlex");}r.writeClasses();if(t.getRowHeight()&&t.getVisibleRowCountMode()==V.Auto){r.addStyle("max-height",t.getRowHeight()+"px");}r.writeStyles();r.write(">");this.renderTableCellControl(r,t,c,j);r.write("</div></td>");}};b.renderTableCellControl=function(r,t,c,i){if(i&&T.Grouping.isTreeMode(t)){var o=c.getParent();r.write("<span class='sapUiTableTreeIcon' tabindex='-1' id='"+o.getId()+"-treeicon'");t._getAccRenderExtension().writeAriaAttributesFor(r,t,"TREEICON",{row:o});r.write("></span>");}r.renderControl(c);};b.renderVSb=function(r,t){r.write("<div");r.addClass("sapUiTableVSbBg");r.writeAttribute("id",t.getId()+"-vsb-bg");r.writeClasses();r.write("></div>");r.write("<div");r.addClass("sapUiTableVSb");r.writeClasses();r.writeAttribute("id",t.getId()+"-vsb");r.writeAttribute("tabindex","-1");r.addStyle("max-height",t._getVSbHeight()+"px");if(t.getFixedRowCount()>0){t._iVsbTop=(t.getFixedRowCount()*t._getDefaultRowHeight())-1;r.addStyle("top",t._iVsbTop+'px');}r.writeStyles();r.write(">");r.write("<div");r.writeAttribute("id",t.getId()+"-vsb-content");r.addClass("sapUiTableVSbContent");r.writeClasses();r.addStyle("height",t._getTotalScrollRange()+"px");r.writeStyles();r.write(">");r.write("</div>");r.write("</div>");};b.renderHSb=function(r,t){r.write("<div");r.addClass("sapUiTableHSbBg");r.writeAttribute("id",t.getId()+"-hsb-bg");r.writeClasses();r.write("></div>");r.write("<div");r.addClass("sapUiTableHSb");r.writeClasses();r.writeAttribute("id",t.getId()+"-hsb");r.writeAttribute("tabindex","-1");r.write(">");r.write("<div");r.writeAttribute("id",t.getId()+"-hsb-content");r.addClass("sapUiTableHSbContent");r.writeClasses();r.write(">");r.write("</div>");r.write("</div>");};b.renderTabElement=function(r,c){r.write("<div");if(c){r.addClass(c);r.writeClasses();}r.writeAttribute("tabindex","0");r.write("></div>");};return b;},true);
