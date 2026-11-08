(function(){
 var $=function(i){return document.getElementById(i)};
 var ps=document.createElement('style');document.head.appendChild(ps);
 var imgs=[],uid=0;
 function setPage(v){ps.textContent='@page{size:'+v+';margin:18mm}';document.documentElement.style.setProperty('--ph',v==='A4'?'261mm':'243mm')}
 function renderText(){
  var p=$('paper');p.dir=$('dir').value;p.style.fontSize=$('size').value+'px';p.style.lineHeight=$('gap').value;
  $('pt').textContent=$('title').value;$('pt').style.display=$('title').value?'block':'none';
  $('pb').textContent=$('text').value||'ستظهر معاينة النص هنا.';
 }
 ['title','text','size','dir','gap'].forEach(function(i){$(i).addEventListener('input',renderText)});
 $('page').addEventListener('input',function(){$('page2').value=this.value;setPage(this.value)});
 $('page2').addEventListener('input',function(){$('page').value=this.value;setPage(this.value)});

 function tab(n){
  var one=n===1;
  $('t1').setAttribute('aria-selected',one);$('t2').setAttribute('aria-selected',!one);
  $('p1').classList.toggle('hidden',!one);$('p2').classList.toggle('hidden',one);
  document.body.className=one?'m-text':'m-img';
  $('textprint').classList.toggle('hidden',!one);
 }
 $('t1').onclick=function(){tab(1)};$('t2').onclick=function(){tab(2)};

 function drawImgs(){
  var t=$('thumbs');t.innerHTML='';$('imgprint').innerHTML='';
  imgs.forEach(function(o,i){
   var d=document.createElement('div');d.className='th';
   var im=document.createElement('img');im.src=o.url;im.alt='صورة '+(i+1);
   var b=document.createElement('button');b.type='button';b.textContent='×';b.setAttribute('aria-label','حذف الصورة');
   b.onclick=function(){URL.revokeObjectURL(o.url);imgs=imgs.filter(function(x){return x.id!==o.id});drawImgs()};
   var n=document.createElement('span');n.textContent=i+1;
   d.appendChild(im);d.appendChild(b);d.appendChild(n);t.appendChild(d);
   var pg=document.createElement('div');pg.className='ip';var pi=document.createElement('img');pi.src=o.url;pg.appendChild(pi);$('imgprint').appendChild(pg);
  });
 }
 $('files').addEventListener('change',function(){
  Array.prototype.forEach.call(this.files,function(f){imgs.push({id:++uid,url:URL.createObjectURL(f)})});
  this.value='';drawImgs();
 });

 $('go1').onclick=function(){
  if(!$('text').value.trim()){$('text').focus();return}
  renderText();setPage($('page').value);window.print();
 };
 $('go2').onclick=function(){
  if(!imgs.length){$('files').click();return}
  setPage($('page2').value);
  var all=Array.prototype.map.call(document.querySelectorAll('#imgprint img'),function(i){return i.decode?i.decode().catch(function(){}):0});
  Promise.all(all).then(function(){window.print()});
 };
 setPage('A4');renderText();
 if(document.body.dataset.start==='2')tab(2);
})();