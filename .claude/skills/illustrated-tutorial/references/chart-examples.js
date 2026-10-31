/* Original chart functions from K8S新手圖解教學.html (16 lessons).
   Copy any function into the charts object of the runtime script and reference it with
   <div class="chart" data-chart="name"></div>. Helpers used here (S,T,L,R,P,C,frame,poly,legend,interp,V)
   are defined right above charts in assets/template.html. */
    const charts={
      /* L1：房子 vs 公寓 */
      apartment(){
        let b=T(165,22,'VM：三棟獨立的房子',{b:1,fs:15})+T(485,22,'Container：一棟公寓大樓',{b:1,fs:15});
        [20,125,230].forEach((x,i)=>{
          b+=P(`M${x} 95 L${x+45} 55 L${x+90} 95 Z`,{f:V('purple'),op:.35,s:V('purple')});
          b+=R(x+8,95,74,52,V('green-soft'),{s:V('green')})+T(x+45,126,'App '+'ABC'[i],{fs:13,b:1});
          b+=R(x+4,147,82,34,V('accent-soft'),{s:V('accent')})+T(x+45,168,'自己的 OS',{fs:12});
          b+=T(x+45,198,'獨立水電管線',{fs:11,c:V('muted')});
        });
        b+=R(15,208,310,30,V('purple-soft'),{s:V('purple'),rx:6})+T(170,228,'Hypervisor ＋ 實體主機',{fs:12});
        b+=R(380,50,210,112,V('card2'),{s:V('muted'),rx:4});
        ['A','B','C'].forEach((c,i)=>{b+=R(392+i*66,62,58,88,V('green-soft'),{s:V('green'),rx:3})+T(421+i*66,100,'App '+c,{fs:13,b:1})+T(421+i*66,120,'🔒 獨立',{fs:11,c:V('muted')});});
        b+=R(380,162,210,22,V('orange-soft'),{s:V('orange')})+T(485,177,'Container Runtime',{fs:12});
        b+=R(380,184,210,24,V('accent-soft'),{s:V('accent')})+T(485,201,'共用同一套 Linux Kernel',{fs:12});
        b+=T(485,228,'共用大樓水電，套房各自上鎖',{fs:12,c:V('muted')});
        return S(640,250,b);
      },
      /* L2：Image 圖層與快取 */
      layers(){
        const ls=[['FROM python:3.12-slim','基礎 Image（最大、幾乎不變）'],['WORKDIR /app','建立工作目錄'],['COPY requirements.txt','套件清單（偶爾改）'],['RUN pip install …','安裝套件（最慢）'],['COPY app.py','程式碼（最常改）']];
        let b=T(300,20,'只修改 app.py 後重新 docker build：',{b:1,fs:14});
        ls.forEach((l,i)=>{
          const y=262-i*46,top=i===4,c=top?V('orange'):V('green'),f=top?V('orange-soft'):V('green-soft');
          b+=P(`M60 ${y} L90 ${y-16} L330 ${y-16} L300 ${y} Z`,{f,s:c,w:1.5});
          b+=R(60,y,240,30,f,{s:c});
          b+=P(`M300 ${y} L330 ${y-16} L330 ${y+14} L300 ${y+30} Z`,{f:c,op:.35,s:c,w:1.5});
          b+=T(180,y+20,l[0],{fs:12.5,b:1});
          b+=L(338,y+8,362,y+8,V('muted'),{w:1,d:'3 3'});
          b+=T(370,y+6,(top?'🔨 重新建立':'♻️ 直接用快取'),{a:'start',fs:13,b:1,c:c});
          b+=T(370,y+22,l[1],{a:'start',fs:11.5,c:V('muted')});
        });
        b+=T(60,312,'▲ 越上層越常變動。Docker 從「第一個有變動的層」開始往上重建，所以把常改的檔案放最後，Build 才會快。',{a:'start',fs:12,c:V('muted')});
        return S(640,320,b);
      },
      /* L4：Service 類型同心圓 */
      svcrings(){
        let b='';
        b+=C(300,190,165,V('purple-soft'),{s:V('purple')})+C(300,205,112,V('orange-soft'),{s:V('orange')})+C(300,222,60,V('accent-soft'),{s:V('accent')});
        b+=T(300,52,'LoadBalancer',{b:1,fs:15,c:V('purple')})+T(300,70,'向雲端申請外部 LB（如 AWS NLB）',{fs:12});
        b+=T(300,118,'NodePort',{b:1,fs:15,c:V('orange')})+T(300,136,'每台 Node 開放同一個 Port',{fs:12});
        b+=T(300,215,'ClusterIP',{b:1,fs:15,c:V('accent')})+T(300,233,'叢集內的虛擬 IP',{fs:12});
        b+=T(560,70,'🌐 Internet',{a:'end',fs:13})+L(500,78,428,110,V('muted'),{d:'4 3'});
        b+=T(560,170,'🖥️ 能連到 Node 的外部機器',{a:'end',fs:13})+L(470,176,410,186,V('muted'),{d:'4 3'});
        b+=T(40,262,'📦 叢集內的 Pod',{a:'start',fs:13})+L(140,258,250,234,V('muted'),{d:'4 3'});
        return S(600,370,b);
      },
      /* L6：CPU 節流 */
      cpu(){
        const W=360,H=250,f=frame(W,H,{xmax:60,ymax:800,yticks:[0,200,400,600,800],xticks:[0,20,40,60],xlab:'時間（秒）',ylab:'CPU（m）'});
        const dem=[[0,100],[10,150],[20,350],[30,720],[40,700],[50,380],[60,180]];
        const smp=[];for(let t=0;t<=60;t+=0.5)smp.push([t,interp(dem,t)]);
        const over=smp.filter(p=>p[1]>500);
        let area='';if(over.length){area='M'+f.X(over[0][0])+' '+f.Y(500)+' '+over.map(p=>'L'+f.X(p[0]).toFixed(1)+' '+f.Y(p[1]).toFixed(1)).join(' ')+' L'+f.X(over[over.length-1][0])+' '+f.Y(500)+' Z';}
        let b=f.b+P(area,{f:V('orange'),op:.3});
        b+=L(f.x0,f.Y(500),f.x1,f.Y(500),V('red'),{w:2,d:'7 4'})+T(f.x1,f.Y(500)-6,'limits 500m',{a:'end',fs:11.5,c:V('red'),b:1});
        b+=L(f.x0,f.Y(200),f.x1,f.Y(200),V('green'),{w:2,d:'7 4'})+T(f.x1,f.Y(200)-6,'requests 200m',{a:'end',fs:11.5,c:V('green'),b:1});
        b+=P(poly(smp,f.X,f.Y),{s:V('muted'),w:1.5,d:'3 3'});
        b+=P(poly(smp.map(p=>[p[0],Math.min(500,p[1])]),f.X,f.Y),{s:V('accent'),w:3});
        b+=T(f.X(35),f.Y(760),'⏳ Throttling',{fs:12,b:1,c:V('orange')});
        return S(W,H,b);
      },
      /* L6：記憶體 OOM */
      mem(){
        const W=360,H=250,f=frame(W,H,{xmax:60,ymax:640,yticks:[0,128,256,384,512,640],xticks:[0,20,40,60],xlab:'時間（秒）',ylab:'記憶體（Mi）'});
        let b=f.b;
        b+=L(f.x0,f.Y(512),f.x1,f.Y(512),V('red'),{w:2,d:'7 4'})+T(f.x1,f.Y(512)-6,'limits 512Mi',{a:'end',fs:11.5,c:V('red'),b:1});
        b+=L(f.x0,f.Y(256),f.x1,f.Y(256),V('green'),{w:2,d:'7 4'})+T(f.x1,f.Y(256)+15,'requests 256Mi',{a:'end',fs:11.5,c:V('green'),b:1});
        b+=P(poly([[0,140],[12,280],[22,420],[28,512]],f.X,f.Y),{s:V('accent'),w:3});
        b+=L(f.X(28),f.Y(512),f.X(28),f.Y(0),V('red'),{w:2});
        b+=P(poly([[31,110],[42,280],[52,380],[60,440]],f.X,f.Y),{s:V('accent'),w:3});
        b+=T(f.X(28),f.Y(585),'💥 OOMKilled',{fs:12,b:1,c:V('red')});
        b+=T(f.X(43),f.Y(150),'↻ 重啟後從頭來',{fs:11.5,c:V('muted')});
        return S(W,H,b);
      },
      /* L6：HPA 擴縮時間軸 */
      hpa(){
        const W=660,H=290,f=frame(W,H,{xmax:30,ymax:1000,yticks:[0,250,500,750,1000],xticks:[0,5,10,15,20,25,30],xlab:'時間（分鐘）',ylab:'流量（RPS）',right:1});
        const Y2=r=>f.y1-r/10*(f.y1-f.y0);
        const tr=[[0,200],[5,200],[10,800],[18,800],[20,200],[30,200]];
        let b=f.b;
        [0,2,4,6,8,10].forEach(r=>b+=T(f.x1+8,Y2(r)+4,r,{a:'start',fs:11,c:V('orange')}));
        b+=T(f.x1+8,f.y0-14,'Pod 數',{a:'start',fs:12,c:V('orange')});
        b+=P(poly(tr,f.X,f.Y)+` L${f.X(30)} ${f.y1} L${f.X(0)} ${f.y1} Z`,{f:V('accent'),op:.18});
        b+=P(poly(tr,f.X,f.Y),{s:V('accent'),w:2.5});
        const st=[[0,2],[7,2],[7,3],[8.5,3],[8.5,5],[10.5,5],[10.5,8],[25.5,8],[25.5,2],[30,2]];
        b+=P(st.map((p,i)=>(i?'L':'M')+f.X(p[0])+' '+Y2(p[1])).join(' '),{s:V('orange'),w:3.5});
        b+=R(f.X(5),f.y0+2,f.X(10.5)-f.X(5),18,V('yellow'),{op:.18,rx:4})+T((f.X(5)+f.X(10.5))/2,f.y0+15,'擴容會落後',{fs:11.5,b:1,c:V('yellow')});
        b+=T((f.X(5)+f.X(10.5))/2,f.y0+34,'等指標、等 Pod 啟動',{fs:11,c:V('muted')});
        b+=R(f.X(20),f.y0+2,f.X(25.5)-f.X(20),18,V('purple'),{op:.2,rx:4})+T((f.X(20)+f.X(25.5))/2,f.y0+15,'縮容穩定視窗',{fs:11.5,b:1,c:V('purple')});
        b+=T((f.X(20)+f.X(25.5))/2,f.y0+34,'約 5 分鐘才縮',{fs:11,c:V('muted')});
        b+=legend(200,14,[{c:V('accent'),t:'流量（左軸）',op:.6}])+legend(340,14,[{c:V('orange'),t:'HPA 的 Pod 數（右軸）'}]);
        return S(W,H,b);
      },
      /* L11：Canary 權重時間軸 */
      canary(){
        const W=660,H=280,f=frame(W,H,{xmax:40,ymax:100,yticks:[0,25,50,75,100],xticks:[0,10,20,30,40],xlab:'時間（分鐘）',ylab:'新版流量比例',yfmt:v=>v+'%'});
        const ok=[[0,5],[10,5],[10,20],[20,20],[20,50],[30,50],[30,100],[40,100]];
        let b=f.b+P(poly(ok,f.X,f.Y)+` L${f.X(40)} ${f.y1} L${f.X(0)} ${f.y1} Z`,{f:V('purple'),op:.16});
        b+=P(poly(ok,f.X,f.Y),{s:V('purple'),w:3});
        b+=P(poly([[10,20],[15,20],[15,0],[40,0]],f.X,f.Y),{s:V('red'),w:2.5,d:'7 4'});
        [[10,5],[20,20],[30,50]].forEach(p=>{b+=C(f.X(p[0]),f.Y(p[1]),6,V('green'),{s:V('card'),sw:2})+T(f.X(p[0]),f.Y(p[1])+20,'✓ 分析通過',{fs:11,c:V('green')});});
        [[5,5,'5%'],[15,20,'20%'],[25,50,'50%'],[35,100,'100%']].forEach(p=>b+=T(f.X(p[0]),f.Y(p[1])-8,p[2],{fs:13,b:1,c:V('purple')}));
        b+=C(f.X(15),f.Y(20),6,V('red'),{s:V('card'),sw:2})+T(f.X(15)+10,f.Y(0)-10,'⛔ 若此時分析失敗：權重立刻歸 0',{a:'start',fs:12,b:1,c:V('red')});
        return S(W,H,b);
      },
      /* L11：發布策略雷達圖 */
      radar(){
        const ax=['實作簡單','新版預先驗證','精準流量控制','限制故障範圍','省資源','回滾簡單'];
        const sr=[{n:'Rolling Update',c:V('green'),v:[3,1,1,2,3,2.5]},{n:'Blue-Green',c:V('accent'),v:[2,3,1.5,1,1,2]},{n:'Canary',c:V('purple'),v:[1,3,3,3,1.5,1.5]}];
        const cx=270,cy=225,r=140,ang=i=>(-90+i*60)*Math.PI/180,pt=(i,v)=>[cx+Math.cos(ang(i))*r*v/3,cy+Math.sin(ang(i))*r*v/3];
        let b='';
        [1,2,3].forEach(k=>b+=P(ax.map((_,i)=>(i?'L':'M')+pt(i,k).join(' ')).join(' ')+'Z',{s:V('line'),w:1}));
        ax.forEach((a,i)=>{const[x,y]=pt(i,3);const[lx,ly]=pt(i,3.55);b+=L(cx,cy,x,y,V('line'),{w:1})+T(lx,ly+4,a,{fs:13,b:1});});
        [1,2,3].forEach(k=>b+=T(cx+4,cy-r*k/3+4,['低','中','高'][k-1],{a:'start',fs:10,c:V('muted')}));
        sr.forEach(s=>b+=P(s.v.map((v,i)=>(i?'L':'M')+pt(i,v).join(' ')).join(' ')+'Z',{f:s.c,op:.14,s:s.c,w:2.5}));
        b+=legend(10,18,sr.map(s=>({c:s.c,t:s.n,op:.7})));
        return S(540,420,b);
      },
      /* L13：Sidecar vs Ambient 象形圖 */
      waffle(){
        let b=T(160,20,'Sidecar：約 1,000 個 Proxy',{b:1,fs:14,c:V('orange')})+T(495,20,'Ambient：約 40 個 ztunnel',{b:1,fs:14,c:V('green')});
        for(let i=0;i<1000;i++)b+=R(10+(i%40)*7.5,34+Math.floor(i/40)*7.5,6,6,V('orange'),{rx:1});
        for(let i=0;i<40;i++)b+=R(420+(i%8)*19,34+Math.floor(i/8)*19,16,16,V('green'),{rx:3});
        b+=T(160,240,'每個 App Pod 旁邊都有一個 Envoy',{fs:12,c:V('muted')});
        b+=T(495,150,'每個 Node 一個（40 個 Node）',{fs:12,c:V('muted')});
        b+=T(495,170,'需要 L7 時再加少量 Waypoint',{fs:12,c:V('muted')});
        return S(640,250,b);
      },
      /* L13：Retry 放大長條圖 */
      retry(){
        const d=[['原始請求',1,'green'],['Payment 收到',3,'yellow'],['Billing 收到',9,'orange'],['若再多一層',27,'red']];
        const W=600,H=270,x0=60,y1=220,top=30,bw=90,gap=40;
        let b=L(x0,y1,W-20,y1,V('muted'))+T(x0-10,top-10,'最多收到的請求數',{a:'start',fs:12,c:V('muted')});
        d.forEach((v,i)=>{const h=(v[1]/27)*(y1-top-10),x=x0+20+i*(bw+gap);b+=R(x,y1-h,bw,h,V(v[2]),{rx:4,op:.85})+T(x+bw/2,y1-h-8,'×'+v[1],{fs:15,b:1,c:V(v[2])})+T(x+bw/2,y1+18,v[0],{fs:12.5});});
        b+=T(W/2,H-6,'每一層都「最多重試 3 次」時，越下游放大越多（3ⁿ）',{fs:12,c:V('muted')});
        return S(W,H,b);
      },
      /* L15：Region 故障切換時間軸 */
      drline(){
        const ev=[[60,'故障前 10 秒',['最後一筆資料','複寫到美東'],1,'muted'],[170,'第 0 分鐘',['東京 Region 故障','監控告警觸發'],0,'red'],[280,'第 1 分鐘',['確認災難','與切換條件'],1,'yellow'],
                  [390,'第 2 分鐘',['美東 DB Failover','新 Primary Ready'],0,'purple'],[500,'第 3 分鐘',['驗證 API、DB','與依賴服務'],1,'yellow'],[610,'第 4 分鐘',['切換流量到美東','服務恢復'],0,'green']];
        let b=L(30,150,660,150,V('muted'),{w:2.5})+P('M660 144 L672 150 L660 156 Z',{f:V('muted')});
        ev.forEach(([x,tm,lines,up,c])=>{
          const by=up?62:178;
          b+=L(x,150,x,up?112:178,V(c),{w:1.5,d:'3 3'})+C(x,150,7,V(c),{s:V('card'),sw:2});
          b+=R(x-62,by,124,50,V('card2'),{s:V(c),rx:8});
          b+=T(x,by+20,lines[0],{fs:12.5,b:1})+T(x,by+38,lines[1],{fs:12,c:V('muted')});
          b+=T(x,up?172:136,tm,{fs:11.5,c:V(c),b:1});
        });
        b+=L(60,30,170,30,V('orange'),{w:3})+L(60,24,60,36,V('orange'),{w:3})+L(170,24,170,36,V('orange'),{w:3})+T(115,20,'RPO ≈ 10 秒（遺失的資料）',{fs:12,b:1,c:V('orange')});
        b+=L(170,248,610,248,V('accent'),{w:3})+L(170,242,170,254,V('accent'),{w:3})+L(610,242,610,254,V('accent'),{w:3})+T(390,270,'RTO ≈ 4 分鐘（服務中斷的時間）',{fs:12.5,b:1,c:V('accent')});
        return S(690,280,b);
      },
      /* L16：延遲分布直方圖 */
      latency(){
        const cnt=[6,34,78,98,82,60,42,30,22,16,12,9,7,6,5,4.5,4,3.5,3,2.5];
        const W=660,H=280,f=frame(W,H,{xmax:1000,ymax:100,yticks:[0,25,50,75,100],xticks:[0,200,400,600,800,1000],xlab:'請求延遲（ms）',ylab:'請求數'});
        const tot=cnt.reduce((a,b)=>a+b,0);let b=f.b;
        cnt.forEach((c,i)=>b+=R(f.X(i*50)+1,f.Y(c),f.X(50)-f.X(0)-2,f.y1-f.Y(c),V('accent'),{op:.7,rx:2}));
        const pct=p=>{let acc=0;for(let i=0;i<cnt.length;i++){if(acc+cnt[i]>=p*tot)return i*50+50*((p*tot-acc)/cnt[i]);acc+=cnt[i];}return 1000;};
        const mean=cnt.reduce((a,c,i)=>a+c*(i*50+25),0)/tot;
        [[mean,'平均','muted'],[pct(.5),'P50','green'],[pct(.95),'P95','orange'],[pct(.99),'P99','red']].forEach((m,i)=>{const x=f.X(m[0]),e=m[0]>700;b+=L(x,f.y0,x,f.y1,V(m[2]),{w:2,d:'6 4'})+T(e?x-5:x+5,f.y0+14+i*16,`${m[1]} ≈ ${Math.round(m[0])}ms`,{a:e?'end':'start',fs:12,b:1,c:V(m[2])});});
        b+=T(f.X(800),f.Y(48),'← 長尾：少數請求等很久',{fs:12,c:V('muted')});
        return S(W,H,b);
      }
    };
