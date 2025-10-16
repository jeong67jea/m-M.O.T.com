// js/lang-switch.js
(function () {
  var sel = document.getElementById('lang');
  if (!sel) return;

  // 현재 URL의 path를 안전하게 가져오기 (file://, Windows 경로 모두 대응)
  function getPath() {
    return location.pathname.replace(/\\/g, '/');
  }

  function getDir(path) {
    return path.replace(/[^/]*$/, ''); // 마지막 파일명 제거
  }

  function getFile(path) {
    var name = path.split('/').pop();
    return name && name.length ? name : 'index.html';
  }

  // /ko/, /en/, /cn/ 중 하나가 중간 디렉터리에 있으면 제거 (언어없는 base 디렉터리)
  function stripLangOnce(dir) {
    return dir.replace(/\/(ko|en|cn)\//i, '/');
  }

  // 드롭다운 초기값: URL에서 현재 언어 감지
  (function initSelectFromURL() {
    var m = getPath().match(/\/(ko|en|cn)(?=\/)/i);
    sel.value = m ? m[1].toLowerCase() : 'ko'; // ko 기본
  })();

  // 언어 변경 시 이동
  sel.addEventListener('change', function () {
    var to = sel.value;                 // 'ko' | 'en' | 'cn'
    var path = getPath();
    var dir  = getDir(path);
    var file = getFile(path);

    // 언어 없는 base 디렉터리로 정리 (예: /mobile/en/ → /mobile/)
    var base = stripLangOnce(dir);

    var newPath;
    if (to === 'ko') {
      // ko는 특수: 메인은 /mobile/index.html, 하위는 /mobile/ko/파일명
      if (file.toLowerCase() === 'index.html') {
        newPath = base + 'index.html';
      } else {
        newPath = base + 'ko/' + file;
      }
    } else {
      // en/cn: 메인은 /mobile/{lang}/index.html, 하위는 /mobile/{lang}/파일명
      if (file.toLowerCase() === 'index.html') {
        newPath = base + to + '/index.html';
      } else {
        newPath = base + to + '/' + file;
      }
    }

    // file:// 환경까지 정확히 이동 (origin 대신 현재 href에서 prefix 추출)
    var href  = location.href.replace(/\\/g, '/');
    var idx   = href.indexOf(location.pathname);
    var pref  = href.slice(0, idx); // 'file:///D:' 또는 'http(s)://host'
    var next  = pref + newPath + location.search + location.hash;

    location.href = next;
  });
})();
