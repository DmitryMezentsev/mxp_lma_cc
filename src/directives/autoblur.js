/**
 * Для автоматического удаления фокуса с кнопок после клика
 */
export default {
    inserted (el) {
        el.onclick = () => el.blur();
    },
}
