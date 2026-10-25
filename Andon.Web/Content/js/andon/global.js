const modalElement = document.getElementById("page-modal");
let loadingOverlay = document.getElementById('loadingOverlay');
window.globalMessages = document.querySelector('#global-messages')?.dataset;
window.url = document.getElementById("url").value;

const ToastVariant = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'destructive',
    INFO: 'primary',
    WARNING: 'warning',
    NEUTRAL: 'secondary',
});

function showLoading() {
    loadingOverlay.classList.remove('hidden');
    loadingOverlay.style.opacity = 0;
    loadingOverlay.style.transition = 'opacity 0.3s ease';

    requestAnimationFrame(() => {
        loadingOverlay.style.opacity = 0.75;
    });
    document.body.classList.add('overflow-hidden');
}

function hideLoading() {
    loadingOverlay.style.opacity = 0;

    loadingOverlay.addEventListener('transitionend', function handleTransitionEnd() {
        loadingOverlay.classList.add('hidden');
        loadingOverlay.removeEventListener('transitionend', handleTransitionEnd);
    });
    document.body.classList.remove('overflow-hidden');
}

function showToast(message, variant) {
    if (!Object.values(ToastVariant).includes(variant)) {
        variant = ToastVariant.NEUTRAL;
    }
    let iconClass = '';
    switch (variant) {
        case ToastVariant.SUCCESS:
            iconClass = 'ki-filled ki-check-circle text-white';
            break;
        case ToastVariant.ERROR:
            iconClass = 'ki-filled ki-cross-circle text-white';
            break;
        default:
            iconClass = 'ki-filled ki-information text-white';
    }
    KTToast.show({
        message: message,
        position: 'bottom-end',
        size: 'lg',
        appearance: 'solid',
        beep: true,
        variant: variant,
        icon: `<i class="${iconClass}"></i>`,
        customClass: 'mt-8',
    });
}
