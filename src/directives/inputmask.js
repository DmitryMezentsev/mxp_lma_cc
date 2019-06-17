import Inputmask from 'inputmask';

export default (() => {
  return {
    bind(el, binding) {
      const input = el.getElementsByTagName('input')[0];
      let mask;

      if (input.type === 'tel') {
        mask = '+9 (999) 999-9999';
      } else {
        mask = binding.value;
      }

      Inputmask({
        mask,
        autoUnmask: true,
      }).mask(input);
    },
  };
})();
