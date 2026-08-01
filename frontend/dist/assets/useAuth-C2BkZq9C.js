import{c as n,b as m,d as o}from"./index-CdryzSBh.js";import{o as r,s as a}from"./types-JbqBi2h9.js";import{a as t,u as i}from"./FormField-Bvxfg78C.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=n("EyeOff",[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]]);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=n("Eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]),u=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/,f=r({email:a().email("Please enter a valid email address"),password:a().min(1,"Password is required")}),w=r({name:a().min(3,"Name must be at least 3 characters").max(32),email:a().email("Please enter a valid email address"),phone:a().regex(/^[0-9]{4,14}$/,"Phone must be 4–14 digits, no country code or spaces"),password:a().regex(u,"Password must be at least 8 characters with uppercase, lowercase, number and special character (@$!%*?&^#)"),confirmPassword:a().min(1,"Please confirm your password")}).refine(e=>e.password===e.confirmPassword,{message:"Passwords do not match",path:["confirmPassword"]}),c={signup:e=>t.post("/authentication/signup",e).then(s=>s.data),signin:e=>t.post("/authentication/signin",e).then(s=>s.data)};function P(){const{login:e}=m(),s=o();return i({mutationFn:c.signin,onSuccess:d=>{e(d.data),s("/projects")}})}function b(){const e=o();return i({mutationFn:c.signup,onSuccess:()=>{e("/login",{state:{registered:!0}})}})}export{l as E,y as a,b,f as l,w as r,P as u};
