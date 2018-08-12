function injectedJavaScript() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;

  function sendSearchList() {
    let result = { items: [], hasNext: false };
    document.querySelectorAll('.news-box li').forEach((_li) => {
      result.items.push({
        name: _li.querySelector('.tit').innerText,
        link: _li.querySelector('.img-box a').href,
        imgUrl: _li.querySelector('.img-box img').src,
        account: _li.querySelector('[name="em_weixinhao"]').innerText,
        description: _li.querySelectorAll('dd')[0].innerText,
      });
    });
    if (document.querySelector('#sogou_next')) {
      result.hasNext = true;
    }
    window.postMessage(JSON.stringify(result), '');
  }

  function sendPostList() {
    let result = { items: [] };
    document.querySelectorAll('.weui_media_box').forEach((_) => {
      result.items.push({
        title: _.querySelector('.weui_media_title').textContent,
        link: _.querySelector('.weui_media_title').getAttribute('hrefs'),
        date: _.querySelector('.weui_media_extra_info').textContent,
        preview: _.querySelector('.weui_media_desc').textContent,
      });
    });
    window.postMessage(JSON.stringify(result), '');
  }

  function sendPostContent() {
    const element = document.body;
    window.postMessage(element.innerHTML, '');
  }

  document.addEventListener('message', (messageEvent) => {
    // Get Weixin recaptcha
    if (document.querySelector('.page_verify')) {
      document.querySelector('.page_verify').style.paddingTop = '40px';
      window.postMessage('PAGE_VERIFY', '');
    } else if (messageEvent.data === '@GetAccountList') {
      sendSearchList();
    } else if (messageEvent.data === '@GetPostList') {
      sendPostList();
    } else if (messageEvent.data === '@GetPostContent') {
      sendPostContent();
    }
  });
}

export { injectedJavaScript };
