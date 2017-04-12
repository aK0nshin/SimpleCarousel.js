function SimpleCarousel(images, targetid) {
    if (!images) {
        throw 'Error: Images source must be an array'
        return false;
    }
    if (images.length==0) {
        console.log('Images source array is empty');
        return false;
    } else {
        var current,
            images_count = images.length;

        function switchIt(element, to, flag) {
            var left = document.getElementsByClassName('sc-arrow-left')[0],
                right = document.getElementsByClassName('sc-arrow-right')[0],
                overlays = document.getElementsByClassName('sc-overlay'),
                overlays_length = overlays.length;
            for (var i = overlays_length; i--;) {
                overlays[i].removeEventListener('click', toggleActive);
            }
            left.removeEventListener('click', moveIt);
            right.removeEventListener('click', moveIt);
            element.style.opacity = 1;
            (function fadeOut() {
                if ((element.style.opacity -= .1) < 0.1) {
                    element.style.display = "none";
                    if (flag) {
                        element.innerHTML = to;
                    } else {
                        element.setAttribute('src', to);
                    }
                    (function () {
                        element.style.opacity = 0;
                        element.style.display = "block";
                        (function fadeIn() {
                            var val = parseFloat(element.style.opacity);
                            if (!((val += .1) > 1)) {
                                element.style.opacity = val;
                                requestAnimationFrame(fadeIn);
                            } else {
                                left.addEventListener('click', moveIt);
                                right.addEventListener('click', moveIt);
                                for (i = overlays_length; i--;) {
                                    overlays[i].addEventListener('click', toggleActive);
                                }
                            }
                        })();
                    })()
                } else {
                    requestAnimationFrame(fadeOut);
                }
            })();
        }

        function makeCarousel(arr) {
            document.getElementById(targetid).innerHTML='<div class="sc sc-carousel"><div class="sc-main-image"></div><div class="sc-previews"></div></div><div class="sc-content"><div class="sc-story"></div></div></div>'
            var image = document.createElement('img');
            image.id = "sc-main-image-el";
            image.src = arr[0].src;
            var previews = '';
            if (arr.length > 1) {
                for (var i = 0, len = arr.length; i < len; ++i) {
                    previews += "<div class='sc-preview'><div data-id='" + i + "' class='sc-overlay " + (i == 0 ? 'active' : '') + "'><img src='" + arr[i].preview + "'/></div></div>";
                }
                document.getElementsByClassName('sc-main-image')[0].innerHTML='<div class="sc-arrow-left"></div> <div class="sc-arrow-right"></div>'
            }
            document.getElementsByClassName('sc-main-image')[0].appendChild(image);
            document.getElementsByClassName('sc-previews')[0].innerHTML = previews;
            document.getElementsByClassName('sc-story')[0].innerHTML = "<p id='sc-description'>" + arr[0].description + "</p>";
            var pow = Math.pow(10,2);
            var width=Math.floor(100/arr.length*pow)/pow;
            var finished_prevs = document.getElementsByClassName('sc-preview');
            for (i=0; i<finished_prevs.length; ++i) {
                finished_prevs[i].style.width=width+'%';
            }
            current = 0;
        }

        function countHeight() {
            var images = document.getElementsByClassName('sc-overlay');
            var smallest;
            for (var i = images_count; i--;) {
                var height = images[i].offsetHeight;
                if (i == 0) {
                    smallest = height;
                } else {
                    if (height < smallest) smallest = height;
                }
            }
            var previews = document.getElementsByClassName('sc-preview');
            for (i = previews.length; i--;) {
                previews[i].style.height = smallest + 'px';
            }
        }
        function moveIt(event) {
            document.getElementsByClassName('sc-overlay active')[0].className = 'sc-overlay';
            var newcur;
            if (event.currentTarget.className.indexOf('left')!=-1) {
                var newcur = (current == 0) ? images_count - 1 : parseInt(current) - 1;
            } else {
                newcur = (current == images_count - 1) ? 0 : parseInt(current) + 1;
            }
            document.querySelector(".sc-overlay[data-id='" + newcur + "']").className += ' active';
            switchIt(document.getElementById('sc-main-image-el'), images[newcur].src);
            switchIt(document.getElementById('sc-description'), images[newcur].description, true);
            current = parseInt(newcur);
        }
        function toggleActive(event) {
            if (event.currentTarget.className.indexOf('active')==-1) {
                document.getElementsByClassName('sc-overlay active')[0].className = 'sc-overlay';
                event.currentTarget.className += ' active'
                switchIt(document.getElementById('sc-main-image-el'), images[event.currentTarget.dataset['id']].src);
                switchIt(document.getElementById('sc-description'), images[event.currentTarget.dataset['id']].description, true);
                current = parseInt(event.currentTarget.dataset['id']);
            } else return false;
        }

        document.addEventListener("DOMContentLoaded", function () {
            makeCarousel(images);
            var elms = document.getElementsByClassName('sc-overlay');
            for (var i = elms.length; i--;) {
                elms[i].addEventListener('click', toggleActive);
            }
            if (images_count>1) {
                document.getElementsByClassName('sc-arrow-right')[0].addEventListener('click', moveIt);
                document.getElementsByClassName('sc-arrow-left')[0].addEventListener('click', moveIt);
            }
        });
        document.onreadystatechange = function () {
            if (document.readyState == "complete") {
                countHeight();
            }
        };
        window.onresize = function () {
            countHeight();
        };
    }
}