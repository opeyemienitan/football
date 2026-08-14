// Shared nav bar, injected into <div id="site-nav"></div> on every page.
(function(){
  var page = document.body.getAttribute('data-page') || '';
  var links = [
    {href:'index.html', label:'Home', key:'home'},
    {href:'draw-display.html', label:'Live Draw', key:'draw'},
    {href:'fixtures.html', label:'Fixtures', key:'fixtures'},
    {href:'stats.html', label:'Stats', key:'stats'}
  ];
  var html = '<div class="brand">⚽ MAR&amp;MOR Tournament 2026</div><div class="links">' +
    links.map(function(l){
      return '<a href="' + l.href + '"' + (l.key === page ? ' class="active"' : '') + '>' + l.label + '</a>';
    }).join('') + '</div>';
  var mount = document.getElementById('site-nav');
  if (mount){ mount.className = 'nav'; mount.innerHTML = html; }
})();
