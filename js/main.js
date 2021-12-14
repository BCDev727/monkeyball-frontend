document.addEventListener("DOMContentLoaded", function() {
    const COURSE = {
        btc: 0.000000667,
        eth: 0.00001,
        usdt: 0.04,
        usdtt: 0.04
    };
    const MIN = 2500;
    const TOKEN = 'mbs';
    const TOTAL = 5000000;
    const ADDRESS = {
        btc: 'bc1qkvz6c5rnqrgrtj4yjx9m5wy8gn5yzs78fax4ce',
        eth: '0xcE327C3bC7e03D66b0DE3128F810187F280fc487',
        usdt: '0xcE327C3bC7e03D66b0DE3128F810187F280fc487',
        usdtt: 'TB3FjZo1QKW19P7QSczi69TMVV8fXX1cha'
    };
    let state = 0;
    let methodNum = 1;
    const progress = [...document.querySelectorAll('[data-progress-id]')];
    const form = [document.getElementById('form-step1'), document.getElementById('form-step2'), document.getElementById('form-step3'), document.getElementById('form-step4')];
    const button = [document.getElementById('form-step1-button'), document.getElementById('form-step2-button'), document.getElementById('form-step3-button'), document.getElementById('form-step4-button')];
    const method = [document.getElementById('method1'), document.getElementById('method2'), document.getElementById('method3'), document.getElementById('method4')];
    const formName = document.getElementById('form-name');
    const formEmail = document.getElementById('form-email');

    const scrollButton = document.getElementById('scroll-button');

    const exchangeSelect = document.getElementById('exchange-select');
    const exchangeIn = document.getElementById('exchange-in');
    const exchangeOut = document.getElementById('exchange-out');
    const courseButtons = [...document.querySelectorAll('[data-id=course-button]')];

    const finalAddress = document.getElementById('final-address');
    const QRs = [...document.querySelectorAll('.final__qr')];
    const tokenLabel = document.getElementById('token-label');
    const addressCopy = document.getElementById('address-copy');

    const modalClose = [...document.querySelectorAll('[data-modal-close]')];
    const modalWindow = document.querySelector('[data-modal-window]');

    const backButtons = [...document.querySelectorAll('[data-back-button]')];

    function update() {
        exchangeIn.value = "";
        exchangeOut.value = "";
        for (let i = 0; i < 4; i++) {
            form[i].classList.add('form--hidden');
            progress[i].classList.remove('progress__stage--checked');
            progress[i].firstElementChild.classList.remove('progress__stagemark--marked');
        }
        for (let i = 0; i <= state; i++) {
            progress[i].firstElementChild.classList.add('progress__stagemark--marked');
        }
        form[state].classList.remove('form--hidden');
        progress[state].classList.add('progress__stage--checked');
    }

    progress.forEach(progressItem=>{
        progressItem.addEventListener('click', ev=>{
            if (Number(ev.target.dataset.progressId) < state) {
                state = Number(ev.target.dataset.progressId);
                update();
            }
        }
        );
    }
    );

    backButtons.forEach(backButton=>{
        backButton.addEventListener('click', ev=>{
            state = Number(ev.target.dataset.backButton);
            update();
        }
        );
    }
    );

    update();

    function convert(amount, token, apply, placeholderOnly) {

        if (token === TOKEN) {
            if (placeholderOnly) {
                exchangeOut.placeholder = Number(Number(amount).toFixed(2));
                exchangeIn.placeholder = amount * COURSE[exchangeSelect.value];
                exchangeOut.value = Number(Number(amount).toFixed(2));
                exchangeIn.value = amount * COURSE[exchangeSelect.value];
            } else {
                if (apply) {
                    exchangeOut.value = Number(Number(amount).toFixed(2));
                }
                exchangeIn.value = amount * COURSE[exchangeSelect.value];
            }
        } else {
            exchangeSelect.value = token;
            ['btc', 'eth', 'usdt', 'usdtt'].forEach(_token=>{
                exchangeSelect.classList.remove(`exchange-input__select--${_token}`);
            }
            );
            exchangeSelect.classList.add(`exchange-input__select--${token}`);
            if (amount) {
                if (placeholderOnly) {
                    exchangeIn.placeholder = Number(Number(amount).toFixed(8));
                    exchangeOut.placeholder = Number((amount / COURSE[exchangeSelect.value]).toFixed(2));
                    exchangeIn.value = Number(Number(amount).toFixed(8));
                    exchangeOut.value = Number((amount / COURSE[exchangeSelect.value]).toFixed(2));
                } else {
                    if (apply) {
                        exchangeIn.value = Number(Number(amount).toFixed(8));
                    }
                    exchangeOut.value = Number((amount / COURSE[exchangeSelect.value]).toFixed(2));
                }
            }
            finalAddress.value = ADDRESS[token];
            QRs.forEach(qr=>{
                qr.classList.add('final__qr--hidden');
                if (qr.classList.contains(`final__qr--${token}`)) {
                    qr.classList.remove('final__qr--hidden');
                }
            }
            );
            tokenLabel.innerText = token.toUpperCase();
        }
    }

    button[0].addEventListener('click', function() {
        if (!formName.value) {
            formName.parentElement.classList.add('form__input--invalid');
            formName.focus();
            return;
        }
        formName.parentElement.classList.remove('form__input--invalid');
        if (!formEmail.value || !formEmail.value.match(/@/)) {
            formEmail.parentElement.classList.add('form__input--invalid');
            formEmail.focus();
            return;
        }
        formEmail.parentElement.classList.remove('form__input--invalid');
        state = 1;
        update();
    });
    function changeMethod() {
        method.forEach(mtd=>{
            mtd.classList.remove('radio-button--checked');
        }
        );
        method[methodNum].classList.add('radio-button--checked');
        button[1].classList.remove('form__submit--bitcoin');
        button[1].classList.remove('form__submit--ethereum');
        button[1].classList.remove('form__submit--tether');
        if (methodNum === 0) {
            button[1].classList.add('form__submit--ethereum');
            convert(1.5, 'eth', false, true);
        } else if (methodNum === 1) {
            button[1].classList.add('form__submit--bitcoin');
            convert(0.105, 'btc', false, true);
        } else if (methodNum === 2) {
            button[1].classList.add('form__submit--tether');
            convert(100, 'usdt', false, true);
        } else {
            button[1].classList.add('form__submit--tether');
            convert(100, 'usdtt', false, true);
        }
    }
    ;
    method.forEach((mtd,index)=>{
        mtd.addEventListener('click', function() {
            methodNum = index;
            changeMethod();
        });
    }
    );

    button[1].addEventListener('click', function() {
        state = 2;
        update();
    });

    exchangeSelect.addEventListener('change', ev=>{
        convert(exchangeIn.value || 0, ev.target.value.toLowerCase(), true);
    }
    );

    exchangeIn.addEventListener('input', ev=>{
        convert(ev.target.value, exchangeSelect.value.toLowerCase());
    }
    );

    exchangeIn.addEventListener('change', ev=>{
        const _token = exchangeSelect.value.toLowerCase();
        const _value = Math.round(ev.target.value / COURSE[_token]);
        if (_value > MIN) {
            convert(ev.target.value, _token, true)
        } else
            convert(MIN, TOKEN, true);
    }
    );

    exchangeOut.addEventListener('input', ev=>{
        convert(ev.target.value, TOKEN);
    }
    );

    exchangeOut.addEventListener('change', ev=>{
        convert((ev.target.value > MIN ? ev.target.value : MIN), TOKEN, true);
    }
    );

    courseButtons.forEach(button=>{
        button.addEventListener('click', ev=>{
            const [amount,token] = ev.target.innerText.split(' ');
            convert(amount, token.toLowerCase(), false, true);
        }
        )
    }
    );

    button[2].addEventListener('click', function() {
        state = 3;
        if (!exchangeIn.value) {
            exchangeIn.parentElement.classList.add('exchange-input--invalid');
            exchangeIn.focus();
        } else if (!exchangeOut.value || exchangeOut.value < MIN) {
            exchangeOut.parentElement.classList.add('exchange-input--invalid');
            exchangeOut.focus();
        } else {
            exchangeIn.parentElement.classList.remove('exchange-input--invalid');
            exchangeOut.parentElement.classList.remove('exchange-input--invalid');
            update();
        }
    });

    addressCopy.addEventListener('click', function() {
        finalAddress.select();
        window.navigator.clipboard.writeText(finalAddress.value).then(()=>{
            addressCopy.classList.add('final__address-copy--anim');
            setTimeout(()=>{
                addressCopy.classList.remove('final__address-copy--anim');
            }
            , 400);
        }
        );
    });

    button[3].addEventListener('click', function() {
        modalClose[0].classList.add('modal--show');
    });

    modalClose.forEach(item=>{
        item.addEventListener('click', ev=>{
            ev.stopPropagation();
            modalClose[0].classList.remove('modal--show');
        }
        );
    }
    );

    modalWindow.addEventListener('click', ev=>ev.stopPropagation());

    var counter = 0;
    function sleep(time) {
        return new Promise((resolve)=>setTimeout(resolve, time));
    }
    function setCookie(cName, cValue, expDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
        return true;
    }
    function getCookie(cName) {
        const name = cName + "=";
        const cDecoded = decodeURIComponent(document.cookie);
        //to be careful
        const cArr = cDecoded.split('; ');
        let res;
        cArr.forEach(val=>{
            if (val.indexOf(name) === 0)
                res = val.substring(name.length);
        }
        )
        return res;
    }
    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp)=>{
            if (!startTimestamp)
                startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            obj.innerHTML = numberWithSpaces((Math.floor(progress * (end - start) + start)).toFixed(0));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }
        ;
        window.requestAnimationFrame(step);
    }

    function sor() {

        let timetotal = 1000;
        function gets(a, b) {
            return Math.random() * (a - b) + b;
        }
        if (counter == 0) {
            J = 1;
            var elem = document.querySelector(".bar-done");
            var elem2 = document.querySelector(".count");
            var elem3 = document.querySelector(".max");
            var width = 25;
            var main = setInterval(frame, 100);
            var c, rich;

            if (getCookie('progress') != undefined)
                rich = getCookie('progress');
            else {
                setCookie('progress', 25, 30);
                rich = 25;
            }
            var totals = (TOTAL / 100) * rich;
            elem2.innerHTML = numberWithSpaces(totals);
            elem3.innerHTML = ' / ' + numberWithSpaces((TOTAL).toFixed(0));
            function frame() {
                if (width >= rich) {
                    clearInterval(main);
                    if (width < 100) {
                        async function is() {
                            let r = gets(0.05, 0.1);
                            width = (+width + r).toFixed(3);
                            rich = width;
                            setCookie('progress', width, 30)
                            totals = (TOTAL / 100) * rich;
                            b_totals = (TOTAL / 100) * (rich - r)
                            elem.style.width = width + "%";
                            elem.innerHTML = '<span class="progr-span">' + width + '%</span>';
                            animateValue(elem2, b_totals, totals.toFixed(0), 1000);
                            if (width >= 100) {
                                elem2.innerHTML = ' / ' + numberWithSpaces((TOTAL).toFixed(0));
                                elem.innerHTML = '<span class="progr-span">' + 100 + '%</span>';
                                setCookie('progress', 25, 30);
                                return;
                            } else {
                                await sleep(gets(10000, 25000).toFixed(0))
                                is();
                            }
                        }
                        is();
                    }
                } else {
                    width++;
                    elem.style.width = width + "%";
                    elem.innerHTML = '<span class="progr-span">' + width + '%</span>';
                }
            }

        }

    }

    sor();
});