import { Fn } from "/#/index"

//获取相关CSS属性
const getCss = function(el: HTMLElement, styleProp: string): string | undefined {
  const defaultView = el.ownerDocument.defaultView;
  // W3C standard way:
  if (defaultView && defaultView.getComputedStyle) {
    // sanitize property name to css notation (hypen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
  } else if (el['currentStyle']) { // IE
    // sanitize property name to camelCase
    styleProp = styleProp.replace(/\-(\w)/g, function(_, letter) {
      return letter.toUpperCase();
    });
    const value: string = el['currentStyle'][styleProp];
    return value;
  }
  return undefined
};

const params = {
  left: 0,
  top: 0,
  currentX: 0,
  currentY: 0,
  flag: false,
};

const startDrag = function(bar: HTMLElement, target: HTMLElement, callback?: Fn | undefined) {
  const screenWidth = document.body.clientWidth; // body当前宽度
  const screenHeight = document.documentElement.clientHeight; // 可见区域高度

  const dragDomW = target.offsetWidth; // 对话框宽度
  const dragDomH = target.offsetHeight; // 对话框高度

  const minDomLeft = target.offsetLeft;
  const minDomTop = target.offsetTop;

  const maxDragDomLeft = screenWidth - minDomLeft - dragDomW;
  const maxDragDomTop = screenHeight - minDomTop - dragDomH;

  if (getCss(target, 'left') !== 'auto') {
    params.left = Number(getCss(target, 'left'));
  }
  if (getCss(target, 'top') !== 'auto') {
    params.top = Number(getCss(target, 'top'));
  }

  //o是移动对象
  bar.onmousedown = function(event: MouseEvent | undefined) {
    params.flag = true;
    if (!event) {
      event = document.createEvent('MouseEvent');
      //防止IE文字选中
      bar.onselectstart = function() {
        return false;
      };
    }
    const e = event;
    params.currentX = e.clientX;
    params.currentY = e.clientY;
  };

  document.onmouseup = function() {
    params.flag = false;
    if (getCss(target, 'left') !== 'auto') {
      params.left = Number(getCss(target, 'left'));
    }
    if (getCss(target, 'top') !== 'auto') {
      params.top = Number(getCss(target, 'top'));
    }
  };
  document.onmousemove = function(event) {
    const e: any = event ? event : window.event;
    if (params.flag) {
      const nowX = e.clientX,
        nowY = e.clientY;
      const disX = nowX - params.currentX,
        disY = nowY - params.currentY;

      let left = parseInt(params.left) + disX;
      let top = parseInt(params.top) + disY;

      // 拖出屏幕边缘
      if (-left > minDomLeft) {
        left = -minDomLeft;
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft;
      }

      if (-top > minDomTop) {
        top = -minDomTop;
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop;
      }

      target.style.left = left + 'px';
      target.style.top = top + 'px';

      if (typeof callback == 'function') {
        callback((parseInt(params.left) || 0) + disX, (parseInt(params.top) || 0) + disY);
      }

      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    }
  };
};

export default startDrag;
