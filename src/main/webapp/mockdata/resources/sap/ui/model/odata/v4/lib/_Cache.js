/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./_Helper","./_SyncPromise"],function(q,_,a){"use strict";function b(m,p,h,D){if(h.$count!==undefined){s(m,p,h,h.$count+D);}}function c(Q,R,D,h){Object.keys(Q).forEach(function(k){var v=Q[k];if(D&&k[0]==='$'){return;}switch(k){case"$expand":v=C.convertExpand(v,h);break;case"$select":if(Array.isArray(v)){v=h?v.sort().join(","):v.join(",");}break;default:}R(k,v);});}function f(A,v,h,E){var i;for(i=h;i<E;i++){A[i]=v;}}function g(h){return h.$count!==undefined?h.$count:Infinity;}function d(R,p){return p===""||R===p||R.indexOf(p+"/")===0;}function r(o,h,E,G,D){var j=o.sQueryString?"&":"?",k=E-h,p,R=o.sResourcePath+o.sQueryString+j+"$skip="+h+"&$top="+k;p=o.oRequestor.request("GET",R,G,undefined,undefined,D).then(function(l){var m,n,i,t=l.value.length;C.computeCount(l);o.sContext=l["@odata.context"];n=l["@odata.count"];if(n){s(o.mChangeListeners,"",o.aElements,n);}for(i=0;i<t;i++){o.aElements[h+i]=l.value[i];}if(t<k){m=Math.min(g(o.aElements),h+t);s(o.mChangeListeners,"",o.aElements,m);o.aElements.length=m;}})["catch"](function(i){f(o.aElements,undefined,h,E);throw i;});o.bSentReadRequest=true;f(o.aElements,p,h,E);}function s(m,p,h,v){if(typeof v==="string"){v=parseInt(v,10);}_.updateCache(m,p,h,{$count:v});}function C(R,h,Q,i){this.bActive=true;this.mChangeListeners={};this.mPatchRequests={};this.mPostRequests={};this.oRequestor=R;this.bSortExpandSelect=i;this.setQueryOptions(Q);this.sResourcePath=h;this.bSentReadRequest=false;}C.prototype._delete=function(G,E,p,h){var i=p.split("/"),D=i.pop(),j=i.join("/"),t=this;return this.fetchValue(G,j).then(function(v){var o=D?v[D]:v,H,T=o["@$ui5.transient"];if(T===true){throw new Error("No 'delete' allowed while waiting for server response");}if(T){t.oRequestor.removePost(T,o);return Promise.resolve();}if(o["$ui5.deleting"]){throw new Error("Must not delete twice: "+E);}o["$ui5.deleting"]=true;H={"If-Match":o["@odata.etag"]};E+=C.buildQueryString(t.mQueryOptions,true);return t.oRequestor.request("DELETE",E,G,H)["catch"](function(k){if(k.status!==404){delete o["$ui5.deleting"];throw k;}}).then(function(){if(Array.isArray(v)){if(v[D]!==o){D=v.indexOf(o);}if(D==="-1"){delete v[-1];}else{v.splice(D,1);}b(t.mChangeListeners,j,v,-1);h(Number(D));}else{if(D){v[D]=null;}else{o["$ui5.deleted"]=true;}h();}});});};C.prototype.addByPath=function(m,p,i){if(i){if(!m[p]){m[p]=[i];}else if(m[p].indexOf(i)>=0){return;}else{m[p].push(i);}}};C.prototype.checkActive=function(){var E;if(!this.bActive){E=new Error("Response discarded: cache is inactive");E.canceled=true;throw E;}};C.prototype.create=function(G,p,h,E,i,j){var v,k,n,l,t=this;function m(){t.removeByPath(t.mPostRequests,h,E);delete k[-1];i();}function o(){E["@$ui5.transient"]=true;}function u(w){E["@$ui5.transient"]=w;return a.resolve(p).then(function(x){x+=C.buildQueryString(t.mQueryOptions,true);t.addByPath(t.mPostRequests,h,E);return t.oRequestor.request("POST",x,w,null,E,o,m).then(function(R){delete E["@$ui5.transient"];b(t.mChangeListeners,h,k,1);t.removeByPath(t.mPostRequests,h,E);_.updateCacheAfterPost(t.mChangeListeners,_.buildPath(h,"-1"),E,R,_.getSelectForPath(t.mQueryOptions,h));},function(y){if(y.canceled){throw y;}if(j){j(y);}return u(w==="$auto"||w==="$direct"?"$parked."+w:w);});});}E=E?JSON.parse(JSON.stringify(E)):{};l=h.split("/");n=l.pop();v=this.fetchValue("$cached",l.join("/")).getResult();k=n?v[n]:v;if(!Array.isArray(k)){throw new Error("Create is only supported for collections; '"+h+"' does not reference a collection");}k[-1]=E;return u(G);};C.prototype.deregisterChange=function(p,l){this.removeByPath(this.mChangeListeners,p,l);};C.prototype.drillDown=function(D,p){var t=this;function i(h){q.sap.log.error("Failed to drill-down into "+p+", invalid segment: "+h,t.toString(),"sap.ui.model.odata.v4.lib._Cache");}if(p){p.split("/").every(function(h){if(h==="$count"){if(!Array.isArray(D)){i(h);D=undefined;return false;}D=D.$count;return true;}if(!D||typeof D!=="object"){if(D!==null){i(h);}D=undefined;return false;}D=D[h];if(D===undefined){i(h);return false;}return true;});}return D;};C.prototype.hasPendingChangesForPath=function(p){return Object.keys(this.mPatchRequests).some(function(R){return d(R,p);})||Object.keys(this.mPostRequests).some(function(R){return d(R,p);});};C.prototype.registerChange=function(p,l){this.addByPath(this.mChangeListeners,p,l);};C.prototype.removeByPath=function(m,p,i){var I=m[p],h;if(I){h=I.indexOf(i);if(h>=0){if(I.length===1){delete m[p];}else{I.splice(h,1);}}}};C.prototype.resetChangesForPath=function(p){var t=this;Object.keys(this.mPatchRequests).forEach(function(R){var i,h;if(d(R,p)){h=t.mPatchRequests[R];for(i=h.length-1;i>=0;i--){t.oRequestor.removePatch(h[i]);}delete t.mPatchRequests[R];}});Object.keys(this.mPostRequests).forEach(function(R){var E,i,T;if(d(R,p)){E=t.mPostRequests[R];for(i=E.length-1;i>=0;i--){T=E[i]["@$ui5.transient"];if(T){t.oRequestor.removePost(T,E[i]);}}delete t.mPostRequests[R];}});};C.prototype.setActive=function(A){this.bActive=A;if(!A){this.mChangeListeners={};}};C.prototype.setQueryOptions=function(Q){if(this.bSentReadRequest){throw new Error("Cannot set query options: Cache has already sent a read request");}this.mQueryOptions=Q;this.sQueryString=C.buildQueryString(Q,false,this.bSortExpandSelect);};C.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath+this.sQueryString;};C.prototype.update=function(G,p,v,E,h,i){var j=p.split("/"),t=this;return this.fetchValue(G,i).then(function(o){var F=_.buildPath(i,p),O,k,l,T,u=C.makeUpdateData(j,v);function m(){t.removeByPath(t.mPatchRequests,F,k);_.updateCache(t.mChangeListeners,i,o,C.makeUpdateData(j,O));}function n(){k=t.oRequestor.request("PATCH",h,G,{"If-Match":o["@odata.etag"]},u,undefined,m);t.addByPath(t.mPatchRequests,F,k);return k.then(function(w){t.removeByPath(t.mPatchRequests,F,k);_.updateCache(t.mChangeListeners,i,o,w);return w;},function(w){t.removeByPath(t.mPatchRequests,F,k);if(!w.canceled){E(w);if(G!=="$auto"&&G!=="$direct"){return n();}}throw w;});}if(!o){throw new Error("Cannot update '"+p+"': '"+i+"' does not exist");}T=o["@$ui5.transient"];if(T){if(T===true){throw new Error("No 'update' allowed while waiting for server response");}if(T.indexOf("$parked.")===0){l=T;T=T.slice(8);}if(T!==G){throw new Error("The entity will be created via group '"+T+"'. Cannot patch via group '"+G+"'");}}O=j.reduce(function(V,w){return V&&V[w];},o);_.updateCache(t.mChangeListeners,i,o,u);if(T){if(l){o["@$ui5.transient"]=T;t.oRequestor.relocate(l,o,T);}return Promise.resolve({});}h+=C.buildQueryString(t.mQueryOptions,true);return n();});};function e(R,h,Q){C.apply(this,arguments);this.sContext=undefined;this.aElements=[];this.aElements.$count=undefined;}e.prototype=Object.create(C.prototype);e.prototype.fetchValue=function(G,p,D,l){var i,o,h,t=this;if(p==="$count"){o=a.all(this.aElements);}else if(p){h=p.split("/");i=parseInt(h.shift(),10);o=this.read(i,1,G,D);}else{o=a.resolve();}return o.then(function(){t.checkActive();t.registerChange(p,l);return t.drillDown(t.aElements,p);});};e.prototype.read=function(I,l,G,D){var i,E=I+l,h=-1,L=this.aElements[-1]?-1:0,j=Math.max(I,0),t=this;if(I<L){throw new Error("Illegal index "+I+", must be >= "+L);}if(l<0){throw new Error("Illegal length "+l+", must be >= 0");}E=Math.min(E,g(this.aElements));for(i=I;i<E;i++){if(this.aElements[i]!==undefined){if(h>=0){r(this,h,i,G,D);D=undefined;h=-1;}}else if(h<0){h=i;}}if(h>=0){r(this,h,E,G,D);D=undefined;}return a.all(this.aElements.slice(j,E)).then(function(){var R;t.checkActive();R={"@odata.context":t.sContext,value:t.aElements.slice(j,E)};R.value.$count=t.aElements.$count;if(I===-1){R.value.unshift(t.aElements[-1]);}return R;});};function P(R,h,Q){C.apply(this,arguments);this.oPromise=null;}P.prototype=Object.create(C.prototype);P.prototype._delete=function(){throw new Error("Unsupported");};P.prototype.create=function(){throw new Error("Unsupported");};P.prototype.fetchValue=function(G,p,D,l){var t=this;t.registerChange("",l);if(!this.oPromise){this.oPromise=a.resolve(this.oRequestor.request("GET",this.sResourcePath+this.sQueryString,G,undefined,undefined,D));this.bSentReadRequest=true;}return this.oPromise.then(function(R){t.checkActive();return R.value;});};P.prototype.update=function(){throw new Error("Unsupported");};function S(R,h,Q,i,p){C.apply(this,arguments);this.bPost=p;this.bPosting=false;this.oPromise=null;}S.prototype=Object.create(C.prototype);S.prototype.post=function(G,D,E){var t=this;if(!this.bPost){throw new Error("POST request not allowed");}if(this.bPosting){throw new Error("Parallel POST requests not allowed");}this.oPromise=a.resolve(this.oRequestor.request("POST",this.sResourcePath,G,{"If-Match":E},D).then(function(R){t.bPosting=false;return R;},function(o){t.bPosting=false;throw o;}));this.bPosting=true;return this.oPromise;};S.prototype.fetchValue=function(G,p,D,l){var t=this,R=this.sResourcePath+this.sQueryString;this.registerChange(p,l);if(!this.oPromise){if(this.bPost){throw new Error("Cannot fetch a value before the POST request");}this.oPromise=a.resolve(this.oRequestor.request("GET",R,G,undefined,undefined,D)).then(function(o){C.computeCount(o);return o;});this.bSentReadRequest=true;}return this.oPromise.then(function(o){t.checkActive();if(o["$ui5.deleted"]){throw new Error("Cannot read a deleted entity");}return t.drillDown(o,p);});};C.buildQueryString=function(Q,D,h){return _.buildQuery(C.convertQueryOptions(Q,D,h));};C.convertExpand=function(E,h){var k,R=[];if(!E||typeof E!=="object"){throw new Error("$expand must be a valid object");}k=Object.keys(E);if(h){k=k.sort();}k.forEach(function(i){var v=E[i];if(v&&typeof v==="object"){R.push(C.convertExpandOptions(i,v,h));}else{R.push(i);}});return R.join(",");};C.convertExpandOptions=function(E,v,h){var i=[];c(v,function(o,O){i.push(o+'='+O);},undefined,h);return i.length?E+"("+i.join(";")+")":E;};C.convertQueryOptions=function(Q,D,h){var m={};if(!Q){return undefined;}c(Q,function(k,v){m[k]=v;},D,h);return m;};C.create=function(R,h,Q,i){return new e(R,h,Q,i);};C.createProperty=function(R,h,Q){return new P(R,h,Q);};C.createSingle=function(R,h,Q,i,p){return new S(R,h,Q,i,p);};C.computeCount=function(R){if(R&&typeof R==="object"){Object.keys(R).forEach(function(k){var h,v=R[k];if(Array.isArray(v)){v.$count=undefined;h=R[k+"@odata.count"];if(h){s({},"",v,h);}else if(!R[k+"@odata.nextLink"]){s({},"",v,v.length);}v.forEach(C.computeCount);}else{C.computeCount(v);}});}};C.makeUpdateData=function(p,v){return p.reduceRight(function(V,h){var R={};R[h]=V;return R;},v);};return C;},false);