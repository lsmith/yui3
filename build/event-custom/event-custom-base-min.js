YUI.add("event-custom-base",function(c){var w="after",h="~AFTER~",C=":",x="|",p=0,d=1,b=["broadcast","monitored","bubbles","context","contextFn","currentTarget","defaultFn","defaultTargetOnly","details","emitFacade","fireOnce","async","host","preventable","preventedFn","queuable","silent","stoppedFn","target","type"],l=9,e="yui:log",v=c.Array,f=c.Lang,o=f.isString,n=f.isArray,m=f.isObject,a=f.isFunction,u=c.cached(function(E){var D=E.indexOf(":");return(D>-1)?"*"+E.slice(D):E;}),t=c.cached(function(D,E){if(!E||!o(D)||D.indexOf(C)>-1){return D;}return E+C+D;}),i={},r={},s,A,y,z;c.Env.evt={handles:r,plugins:i};function k(D,E){this.obj=D;this.methodName=E;this.method=D[E];this.before={};this.after={};}k.prototype={constructor:k,register:function(E,F,D){if(D){this.after[E]=F;}else{this.before[E]=F;}},_delete:function(D){delete this.before[D];delete this.after[D];},exec:function(){var G=v(arguments,0,true),H,F,K,I=this.before,E=this.after,J=false,D=c.Do;for(H in I){if(I.hasOwnProperty(H)){F=I[H].apply(this.obj,G);if(F){switch(F.constructor){case D.Halt:return F.retVal;case D.AlterArgs:G=F.newArgs;break;case D.Prevent:J=true;break;default:}}}}if(!J){F=this.method.apply(this.obj,G);}D.originalRetVal=F;D.currentRetVal=F;for(H in E){if(E.hasOwnProperty(H)){K=E[H].apply(this.obj,G);if(K&&K.constructor==D.Halt){return K.retVal;}else{if(K&&K.constructor==D.AlterReturn){F=K.newRetVal;D.currentRetVal=F;}}}}return F;}};c.Do={Method:k,AlterArgs:function(E,D){this.msg=E;this.newArgs=D;},AlterReturn:function(E,D){this.msg=E;this.newRetVal=D;},Halt:function(E,D){this.msg=E;this.retVal=D;},Prevent:function(D){this.msg=D;},objs:{},before:function(E,G,H,I){var F=E,D;if(I){D=[E,I].concat(v(arguments,4,true));F=c.rbind.apply(c,D);}return this._inject(p,F,G,H);},after:function(E,G,H,I){var F=E,D;if(I){D=[E,I].concat(v(arguments,4,true));F=c.rbind.apply(c,D);}return this._inject(d,F,G,H);},_inject:function(D,F,G,I){var J=c.stamp(G),H,E;if(!this.objs[J]){this.objs[J]={};}H=this.objs[J];if(!H[I]){H[I]=new c.Do.Method(G,I);G[I]=function(){return H[I].exec.apply(H[I],arguments);};}E=J+c.stamp(F)+I;H[I].register(E,F,D);return new c.EventHandle(H[I],E);},detach:function(D){if(D.detach){D.detach();}},_unload:function(E,D){}};c.Do.Error=c.Do.Halt;function g(D,E){this.evt=D;this.sub=E;}g.prototype={batch:function(D,E){D.call(E||this,this);if(f.isArray(this.evt)){c.Array.each(this.evt,function(F){F.batch.call(E||F,D);});}},detach:function(){var D=this.evt,F=0,E;if(D){if(f.isArray(D)){for(E=0;E<D.length;E++){F+=D[E].detach();}}else{D._delete(this.sub);F=1;}}return F;},monitor:function(D){return this.evt.monitor.apply(this.evt,arguments);}};c.EventHandle=g;function q(E,F){var D=this;F=F||{};D.id=c.stamp(D);D.type=E;D.context=c;D.logSystem=(E==e);D.silent=D.logSystem;D.subscribers={};D.afters={};D.preventable=true;D.bubbles=true;D.signature=l;D.subCount=0;D.afterCount=0;D.applyConfig(F,true);}s={hasSubs:function(D){var G=this.subCount,E=this.afterCount,F=this.sibling;if(F){G+=F.subCount;E+=F.afterCount;}if(D){return(D=="after")?E:G;}return(G+E);},monitor:function(G){var D=this,F=D.id+"|"+D.type+"_"+G,E=v(arguments,0,true);D.monitored=true;E[0]=F;return D.host.on.apply(D.host,E);},getSubs:function(){var F=c.merge(this.subscribers),D=c.merge(this.afters),E=this.sibling;if(E){c.mix(F,E.subscribers);c.mix(D,E.afters);}return[F,D];},applyConfig:function(E,D){if(E){c.mix(this,E,D,b);}},_on:function(I,G,F,D){var E=this,H=new c.Subscriber(I,G,F,D);if(E.fireOnce&&E.fired){if(E.async){setTimeout(c.bind(E._notify,E,H,E.firedWith),0);}else{E._notify(H,E.firedWith);}}if(D==w){E.afters[H.id]=H;E.afterCount++;}else{E.subscribers[H.id]=H;E.subCount++;}return new c.EventHandle(E,H);},on:function(F,E){var D=(arguments.length>2)?v(arguments,2,true):null;if(this.host){this.host._monitor("attach",this.type,{args:arguments});}return this._on(F,E,D,true);},after:function(F,E){var D=(arguments.length>2)?v(arguments,2,true):null;return this._on(F,E,D,w);},detach:function(H,F){if(H&&H.detach){return H.detach();}var E,G,I=0,D=c.merge(this.subscribers,this.afters);for(E in D){if(D.hasOwnProperty(E)){G=D[E];if(G&&(!H||H===G.fn)){this._delete(G);I++;}}}return I;},_notify:function(H,G,D){var E=this,F;F=H.notify(G,E);if(false===F||E.stopped>1){return false;}return true;},fire:function(){var D=this,F=(D.emitFacade)?"fireComplex":"fireSimple",E=v(arguments,0,true);if(D.fireOnce){D.fired=true;D.firedWith=E;D.fire=D._fireImmediate;}return D[F](E);},_fireImmediate:function(){return true;},fireSimple:function(E){var D=this,F;D.stopped=0;D.prevented=0;if(D.hasSubs()){F=D.getSubs();D._procSubs(F[0],E);D._procSubs(F[1],E);}D.broadcast&&!D.stopped&&D._broadcast(E);return D.stopped?false:true;},fireComplex:function(D){D[0]=D[0]||{};return this.fireSimple(D);},_procSubs:function(G,E,D){var H,F;for(F in G){if(G.hasOwnProperty(F)){H=G[F];if(H&&H.fn){if(false===this._notify(H,E,D)){this.stopped=2;}if(this.stopped==2){return false;}}}}return true;},_broadcast:function(E){var D=E.slice();D.unshift(this.type);if(this.host!==c){c.fire.apply(c,D);}if(this.broadcast==2){c.Global.fire.apply(c.Global,D);}},detachAll:function(){return this.detach();},_delete:function(E){var D=this;if(E){if(D.subscribers[E.id]){delete D.subscribers[E.id];D.subCount--;}if(D.afters[E.id]){delete D.afters[E.id];D.afterCount--;}}if(D.host){D.host._monitor("detach",D.type,{ce:D,sub:E});}if(E){E.deleted=true;}}};s.unsubscribe=s.detach;s.unsubscribeAll=s.detachAll;q.prototype=s;c.CustomEvent=q;function B(G,F,E){var D=this;D.fn=G;D.context=F;D.id=c.stamp(D);D.args=E;}B.prototype={_notify:function(I,F,G){if(this.deleted&&!this.postponed){delete this.postponed;return null;}var D=this.args,H=this.fn,E;switch(G.signature){case 0:E=H.call(I,G.type,F,I);break;case 1:E=H.call(I,F[0]||null,I);break;default:if(D||F){F=F||[];D=(D)?F.concat(D):F;E=H.apply(I,D);}else{E=H.call(I);}}if(this.once){G._delete(this);}return E;},notify:function(E,G){var H=this.context,D=true;if(!H){H=(G.contextFn)?G.contextFn():G.context;}if(c.config.throwFail){D=this._notify(H,E,G);
}else{try{D=this._notify(H,E,G);}catch(F){c.error(this+" failed: "+F.message,F);}}return D;},contains:function(E,D){if(D){return((this.fn==E)&&this.context==D);}else{return(this.fn==E);}}};c.Subscriber=B;function j(D){var E=(m(D))?D:{};this._yuievt=this._yuievt||{id:c.guid(),events:{},targets:{},config:E,chain:("chain" in E)?E.chain:c.config.chain,bubbling:false,defaults:{context:E.context||this,host:this,emitFacade:E.emitFacade,fireOnce:E.fireOnce,queuable:E.queuable,monitored:E.monitored,broadcast:E.broadcast,defaultTargetOnly:E.defaultTargetOnly,bubbles:("bubbles" in E)?E.bubbles:true}};}j._registerSub=z=function(F,E,G){var D=r[F]||(r[F]={});D=D[E]||(D[E]=[]);D.push(G);};j.prototype={once:function(){var D=this.on.apply(this,arguments);D.batch(function(E){if(E.sub){E.sub.once=true;}});return D;},onceAfter:function(){var D=this.after.apply(this,arguments);D.batch(function(E){if(E.sub){E.sub.once=true;}});return D;},parseType:c.cached(function(H,I){if(typeof H!=="string"){return H;}var G=H.indexOf(h),E=H.indexOf(x),F=0,J,D;if(G>-1){J=true;F=h.length;}if(E>-1){D=H.slice(F,E);F=E+1;}F&&(H=H.slice(F));if(H==="*"){H=null;}return[D,t(H,I),J,H];}),on:function(L,M,E){var G=this.parseType(L,this._yuievt.config.prefix),K,J,H,N,I,D,F;if(m(L)){if(a(L)){return c.Do.before.apply(c.Do,arguments);}H=n(L);J=v(arguments,0,true);N=[];D=(L._after&&(delete L._after))?h:"";c.Object.each(L,function(P,O){if(H){J[0]=D+P;}else{J[0]=D+O;J[1]=P.fn||(a(P)?P:M);J[2]=P.context||E;}N.push(this.on.apply(this,J));},this);return new c.EventHandle(N);}K=G[0];L=G[1];D=G[2];J=(arguments.length>3)?v(arguments,3,true):null;this._monitor("attach",L,{args:arguments,category:K,after:D});F=this._yuievt.events[L]||this.publish(L);I=F._on(M,E,J,(D)?"after":true);K&&z(K,L,I);return I;},subscribe:function(){return this.on.apply(this,arguments);},detach:function(M,O,D){var R=this._yuievt.events,H,J=c.Node,P=J&&(c.instanceOf(this,J));if(!M&&(this!==c)){for(H in R){if(R.hasOwnProperty(H)){R[H].detach(O,D);}}if(P){c.Event.purgeElement(J.getDOMNode(this));}return this;}var G=this.parseType(M,this._yuievt.config.prefix),L=n(G)?G[0]:null,S=(G)?G[3]:null,I,Q,N,K,F,E=function(X,V,W){var U=X[V],Y,T;if(U){for(T=U.length-1;T>=0;--T){Y=U[T].evt;if(Y.host===W||Y.el===W){U[T].detach();}}}};if(L){N=r[L];M=G[1];Q=(P)?c.Node.getDOMNode(this):this;if(N){if(M){E(N,M,Q);}else{for(H in N){if(N.hasOwnProperty(H)){E(N,H,Q);}}}return this;}}else{if(m(M)&&M.detach){M.detach();return this;}else{if(P&&((!S)||(S in J.DOM_EVENTS))){K=v(arguments,0,true);K[2]=J.getDOMNode(this);c.detach.apply(c,K);return this;}}}I=c.Env.evt.plugins[S];if(c.instanceOf(this,YUI)){K=v(arguments,0,true);if(I&&I.detach){I.detach.apply(c,K);return this;}else{if(!M||(!I&&J&&(M in J.DOM_EVENTS))){K[0]=M;c.Event.detach.apply(c.Event,K);return this;}}}F=R[G[1]];if(F){F.detach(O,D);}return this;},unsubscribe:function(){return this.detach.apply(this,arguments);},detachAll:function(D){return this.detach(D);},unsubscribeAll:function(){return this.detachAll.apply(this,arguments);},publish:function(G,H){var J=this._yuievt,I=J.config.prefix,F=J.events,E=J.defaults,D;G=(I)?t(G,I):G;if(!F[G]){if(m(G)){D={};c.each(G,function(L,K){D[K]=this.publish(K,L||H);},this);return D;}H&&(E=c.merge(E,H));F[G]=new c.CustomEvent(G,E);}else{if(H){F[G].applyConfig(H,true);}}return F[G];},_monitor:function(G,D,H){var E,F=this.getEvent(D);if((this._yuievt.config.monitored&&(!F||F.monitored))||(F&&F.monitored)){E=D+"_"+G;H.monitored=G;this.fire.call(this,E,H);}},fire:function(G){var K=(typeof G==="string"),F=(K)?G:(G&&G.type),J,E,I=this._yuievt.config.prefix,H,D=(K)?v(arguments,1,true):arguments;F=(I)?t(F,I):F;this._monitor("fire",F,{args:D});J=this.getEvent(F,true);H=this.getSibling(F,J);if(H&&!J){J=this.publish(F);}if(!J){if(this._yuievt.hasTargets){return this.bubble({type:F},D,this);}E=true;}else{J.sibling=H;E=J.fire.apply(J,D);}return(this._yuievt.chain)?this:E;},getSibling:function(D,F){var E;if(D.indexOf(C)>-1){D=u(D);E=this.getEvent(D,true);if(E){E.applyConfig(F);E.bubbles=false;E.broadcast=0;}}return E;},getEvent:function(E,D){var F;if(!D){F=this._yuievt.config.prefix;E=(F)?t(E,F):E;}return this._yuievt.events[E]||null;},after:function(F,E){var D=v(arguments,0,true);switch(f.type(F)){case"function":return c.Do.after.apply(c.Do,arguments);case"array":case"object":D[0]._after=true;break;default:D[0]=h+F;}return this.on.apply(this,D);},before:function(){return this.on.apply(this,arguments);}};c.EventTarget=j;if(!YUI.Env.globalEvents){YUI.Env.globalEvents=new j({bubbles:false});}c.Global=YUI.Env.globalEvents;s=j.prototype;A=s.on;y=s.detach;c.mix(c,s,true);j.call(c,{bubbles:false});c.on=function(L,M,F){var G=this.parseType(L),J=c.Node,D,I,K,E,H;D=G[3];I=i[D]||(J&&J.DOM_EVENTS[D]);if(!o(D)||!I){return A.apply(this,arguments);}this._monitor("attach",G[1],{args:arguments,category:G[0],after:G[2]});K=v(arguments,0,true);E=G[0];if(J&&m(F)){if(c.instanceOf(F,c.NodeList)){K[2]=c.NodeList.getDOMNodes(F);}else{if(c.instanceOf(F,J)){K[2]=J.getDOMNode(F);}}}H=(I.on)?I.on.apply(c,K):c.Event._attach(K);E&&z(G[0],G[1],H);return H;};c.detach=function(H){if(!H){return this;}var I=this.parseType(H),F=c.Node,E=I[3],G=E&&(i[E]||(F&&F.DOM_EVENTS[E])),D;if(G){D=v(arguments,0,true);D[0]=E;if(G.detach){G.detach.apply(c,D);}else{c.Event.detach.apply(c.Event,D);}}else{y.apply(this,arguments);}return this;};},"@VERSION@",{requires:["oop"]});