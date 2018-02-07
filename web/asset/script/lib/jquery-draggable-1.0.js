(function (factory) {
    if (typeof define === 'function' && define.amd) { // RequireJS 스타일
        define(['jquery', 'vec2d'], factory);
    } else { // RequireJS 가 없을경우 브라우저 window 에 전역선언
        factory(jQuery, vec2d);
    }
}(function ($, vec2d) {

    $.fn.draggable = function (options) {
        
        var settings = $.extend({
            'axis' : 'xy',
        }, options);
        
        return this.each(function() { 

            var self = this;
            var oldEvent = null;
            var isDrag = false;
            
            // 마우스 누르면 이벤트장착
            function mousePress(event) {
                oldEvent = event;
                
                $(document)
                    .bind('mousemove', mouseMove)
                    .bind('mouseup', mouseRelease)
            }

            // 마우스 떼면 이벤트해제
            function mouseRelease() {
                if (isDrag) {
                    $(self).trigger('dragend');
                }
                    
                isDrag = false;
                
                $(document)
                    .unbind('mousemove', mouseMove)
                    .unbind('mouseup', mouseRelease);
            }

            function mouseMove(event) {
                event.preventDefault();
                event.stopPropagation();
                
                var x = parseInt(self.style.left, 10) || 0; 
                var y = parseInt(self.style.top, 10) || 0; 

                // ((현재이벤트 - 이전이벤트) = 움직인거리)
                var dx = event.pageX - oldEvent.pageX;
                var dy = event.pageY - oldEvent.pageY;
                
                if (Math.abs(vec2d(dx, dy).length()) <= 1) {
                    return;
                }

                if (settings.axis.indexOf('x') !== -1) self.style.left = (x + dx) + 'px'; 
                if (settings.axis.indexOf('y') !== -1) self.style.top = (y + dy) + 'px';
                
                if ( ! isDrag) {
                    $(self).trigger('dragstart');
                }
                
                $(self).trigger('drag', [ dx, dy ]);
                
                oldEvent = event;
                isDrag = true;
            }
            
            $(self)
                .css({
                    'position' : 'absolute', 
                    'user-select': 'none' 
                })
                .bind('mousedown', mousePress)
            
        });
    };  

}));