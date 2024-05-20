(()=>{async function e(a){let{page:t}=a,n=()=>Math.floor(Math.random()*(10**6-0));await t.goto("https://example.com/");let o=await t.title(),r=[...Array(5)].map(()=>n());return{data:{url:o,numbers:r},type:"application/json"}}})();
//# sourceMappingURL=out.js.map
