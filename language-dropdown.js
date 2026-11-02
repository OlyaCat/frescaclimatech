/* FrescaClimaTech: unified ES/EN dropdown, reusing each page's existing translation handlers. */
(function(){
  'use strict';
  function init(){
    var pairs=[
      ['[data-fct-lang="es"]','[data-fct-lang="en"]'],
      ['[data-lang="es"]','[data-lang="en"]'],
      ['#btnES','#btnEN'],
      ['#langEs','#langEn'],
      ['.langs #es','.langs #en']
    ];
    var es,en;
    for(var i=0;i<pairs.length;i++){
      es=document.querySelector(pairs[i][0]);en=document.querySelector(pairs[i][1]);
      if(es&&en)break;
      es=null;en=null;
    }
    if(!es||!en)return;
    var parent=es.parentElement;
    if(!parent)return;
    var wrap=document.createElement('label');
    wrap.className='fct-language-dropdown';
    wrap.setAttribute('aria-label','Idioma / Language');
    var select=document.createElement('select');
    select.setAttribute('aria-label','Idioma / Language');
    select.innerHTML='<option value="es">ES</option><option value="en">EN</option>';
    var arrow=document.createElement('span');arrow.className='fct-language-chevron';arrow.setAttribute('aria-hidden','true');arrow.textContent='⌄';
    wrap.appendChild(select);wrap.appendChild(arrow);
    parent.insertBefore(wrap,es);
    es.style.setProperty('display','none','important');
    en.style.setProperty('display','none','important');
    var between=wrap.nextSibling;
    while(between&&between!==en){
      var next=between.nextSibling;
      if(between.nodeType===3&&between.textContent.trim()==='/')between.textContent='';
      else if(between.nodeType===1&&between.textContent.trim()==='/'&&between.children.length===0)between.style.setProperty('display','none','important');
      between=next;
    }
    function current(){
      var l=(document.documentElement.lang||'').toLowerCase();
      if(l==='es'||l==='en')return l;
      if(en.classList.contains('active')||en.classList.contains('on')||en.getAttribute('aria-current')==='true')return 'en';
      return 'es';
    }
    select.value=current();
    select.addEventListener('change',function(){
      (select.value==='en'?en:es).click();
      document.documentElement.lang=select.value;
      try{localStorage.setItem('fctLang',select.value);localStorage.setItem('lang',select.value);}catch(e){}
    });
    var obs=new MutationObserver(function(){var v=current();if(select.value!==v)select.value=v;});
    obs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    window.addEventListener('pageshow',function(){select.value=current();});
  }
  var css=document.createElement('style');
  css.textContent='.fct-language-dropdown{display:inline-flex!important;align-items:center;position:relative;vertical-align:middle;flex:0 0 auto!important;width:auto!important;min-width:66px!important;max-width:90px!important;margin:0 8px 0 0!important;padding:0!important;border:0!important;background:transparent!important;line-height:1!important}.fct-language-dropdown select{appearance:none;-webkit-appearance:none;display:block!important;box-sizing:border-box;width:100%!important;min-width:66px!important;height:36px!important;padding:6px 24px 6px 12px!important;margin:0!important;border:1px solid rgba(100,87,63,.3)!important;border-radius:5px!important;background:transparent!important;color:inherit!important;font:500 13px Manrope,Arial,sans-serif!important;letter-spacing:0!important;cursor:pointer!important}.fct-language-dropdown select:focus-visible{outline:2px solid #b48a32!important;outline-offset:2px!important}.fct-language-chevron{position:absolute;right:9px;top:50%;transform:translateY(-57%);font:500 15px Manrope,Arial,sans-serif;pointer-events:none;color:inherit}';
  css.textContent+='@media(min-width:901px){.fct2-links>a,.fct2-links .fct-service-trigger,.fct-awning-main-links>a,.fct-awning-main-links .fct-awning-menu>button,.fct-air-site-links>a,.fct-air-site-links button,.fct-property-links>a,.fct-property-links button,.fct-cb-links>a,.fct-cb-links summary,.fct-cb-links button,.fct-cds-links>a,.fct-cds-links summary,.fct-cds-links button{font-family:Manrope,Arial,sans-serif!important;font-size:13px!important;font-weight:500!important;line-height:1.4!important}}.fct-language-dropdown select{font-family:Manrope,Arial,sans-serif!important;font-size:13px!important;font-weight:500!important}';
  document.head.appendChild(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();