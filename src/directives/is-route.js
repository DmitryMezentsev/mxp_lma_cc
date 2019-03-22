import router from 'Base/router';


const CLASS_NAME = 'active-route';


export default (() => {
    let removeAfterEach;

    return {
        bind (el, binding) {
            function testRoute (route) {
                if (typeof binding.value === 'string')
                    return route.name === binding.value;

                if (
                    route.name === binding.value.name ||
                    (typeof binding.value.name !== 'string' && binding.value.name.includes(route.name))
                ) {
                    let match = true;

                    if (binding.value.params) {
                        Object.keys(binding.value.params).forEach(param => {
                            if (route.params[param] !== binding.value.params[param]) match = false;
                        });
                    }

                    return match;
                }

                return false;
            }

            removeAfterEach = router.afterEach(to => {
                setTimeout(() => {
                    if (testRoute(to))
                        el.classList.add(CLASS_NAME);
                    else
                        el.classList.remove(CLASS_NAME);
                }, 0);
            });

            if (testRoute(router.currentRoute))
                el.classList.add(CLASS_NAME);
        },
        unbind () {
            if (removeAfterEach) removeAfterEach();
        },
    }
})();