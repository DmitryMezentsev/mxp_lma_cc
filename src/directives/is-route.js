import router from '../router';


const CLASS_NAME = 'active-route';


export default (() => {
    let removeAfterEach;

    return {
        bind (el, binding) {
            removeAfterEach = router.afterEach(to => {
                setTimeout(() => {
                    if (to.name === binding.value)
                        el.classList.add(CLASS_NAME);
                    else
                        el.classList.remove(CLASS_NAME);
                }, 0);
            });

            if (router.currentRoute.name === binding.value)
                el.classList.add(CLASS_NAME);
        },
        unbind () {
            if (removeAfterEach) removeAfterEach();
        },
    }
})();