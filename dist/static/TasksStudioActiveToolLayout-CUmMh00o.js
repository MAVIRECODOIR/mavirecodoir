import{c as h,dO as g,j as r,X as w,dS as y,aM as m,c_ as f,a0 as I,dV as j,bc as p,G as E,cO as S}from"./pane2-B58nn3Po.js";const u=1,b=3,v=m(E).withConfig({displayName:"RootFlex",componentId:"sc-1y8zfkj-0"})(({theme:t})=>{const e=t.sanity.media;return f`
    min-height: 100%;

    @media (max-width: ${e[b]}px) {
      position: relative;
    }
  `}),T=m(S).withConfig({displayName:"SidebarMotionLayer",componentId:"sc-1y8zfkj-1"})(({theme:t})=>{const e=t.sanity.media;return f`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 360px;
    border-left: 1px solid var(--card-border-color);
    box-sizing: border-box;
    overflow: hidden;

    box-shadow:
      0px 6px 8px -4px var(--card-shadow-umbra-color),
      0px 12px 17px -1px var(--card-shadow-penumbra-color);

    @media (max-width: ${e[b]}px) {
      bottom: 0;
      position: absolute;
      right: 0;
      top: 0;
    }

    @media (max-width: ${e[u]}px) {
      border-left: 0;
      min-width: 100%;
      left: 0;
    }
  `});function L(t){const e=h.c(12),x=w(),{state:a}=y(),{isOpen:i}=a,c=x<=u&&i?"hidden":"auto";let o;e[0]!==t?(o=t.renderDefault(t),e[0]=t,e[1]=o):o=e[1];let d;e[2]!==c||e[3]!==o?(d=r.jsx(I,{flex:1,height:"fill",overflow:c,children:o}),e[2]=c,e[3]=o,e[4]=d):d=e[4];let n;e[5]!==i?(n=i&&r.jsx(T,{zOffset:100,height:"fill",children:r.jsx(j,{})}),e[5]=i,e[6]=n):n=e[6];let s;e[7]!==n?(s=r.jsx(p,{initial:!1,children:n}),e[7]=n,e[8]=s):s=e[8];let l;return e[9]!==d||e[10]!==s?(l=r.jsxs(v,{sizing:"border",height:"fill",children:[d,s]}),e[9]=d,e[10]=s,e[11]=l):l=e[11],l}function N(t){const e=h.c(4),{enabled:x}=g();if(!x){let i;return e[0]!==t?(i=t.renderDefault(t),e[0]=t,e[1]=i):i=e[1],i}let a;return e[2]!==t?(a=r.jsx(L,{...t}),e[2]=t,e[3]=a):a=e[3],a}export{N as TasksStudioActiveToolLayout};
