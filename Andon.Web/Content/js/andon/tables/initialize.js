function initializeTable(config, perPageSelector) {
    let initialized = false;
    perPageSelector.addEventListener('change', function () {
        if (!initialized) { initialized = true; return; }
        loadTable(config, 1, parseInt(this.value), getFilters());
    });

    loadTable(config, 1, parseInt(perPageSelector.value), getFilters());
}

function loadTable({ controller, action, tableId }, page = 1, itemsPerPage = 10, filters = {}) {
    const baseParams = {
        page: page,
        itemsPerPage: itemsPerPage,
        ...filters
    };

    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const headerRow = table.querySelector("thead tr");
    const columnCount = headerRow ? headerRow.children.length : 1;

    const loadingHtml = document.getElementById("loading-spinner")?.innerHTML || "<div>Cargando...</div>";
    tbody.innerHTML = `
        <tr>
            <td colspan="${columnCount}" class="text-center py-4">
                <div class="flex justify-center mt-5 mb-5">${loadingHtml}</div>
            </td>
        </tr>
    `;

    const query = new URLSearchParams(baseParams).toString();
    fetch(`${url}/${controller}/${action}?${query}`)
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = data.html;
            renderPagination(controller, action, tableId, data.totalPages, data.page, data.totalItems, itemsPerPage);

            KTDom.ready(function () { KTComponents.init(); KTAccordion.init(); KTTooltip.init(); });
        })
        .catch(error => {
            console.error('Error loading table:', error.message);
            console.error('Error name:', error.name);
            console.error('Stack trace:', error.stack);
        });

}

function renderPagination(controller, action, tableId, totalPages, currentPage, totalItems, itemsPerPage) {
    const container = document.getElementById('paginationContainer');
    container.innerHTML = '';
    container.className = 'flex items-center flex-wrap gap-2';

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const info = document.createElement('div');
    info.textContent = `${startItem}–${endItem} de ${totalItems}`;
    info.className = 'text-gray-600 text-sm mr-4';
    container.appendChild(info);

    const createButton = (labelOrHtml, page, disabled = false, isActive = false, isHtml = false) => {
        const btn = document.createElement('label');
        btn.className = `
      kt-datatable-pagination-button cursor-pointer px-3 py-2
      ${isActive ? 'bg-gray-200 text-gray-900 font-semibold shadow-sm' : 'bg-light text-gray-800'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-900 transition'}
    `.trim();

        if (isHtml) {
            btn.innerHTML = labelOrHtml;
        } else {
            btn.textContent = labelOrHtml;
        }

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'pagination';
        input.value = page;
        input.className = 'hidden';

        if (isActive) input.checked = true;
        if (!disabled && !isActive) {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                loadTable({ controller, action, tableId }, page, itemsPerPage, getFilters());
            };
        }
        btn.appendChild(input);
        return btn;
    };

    if (currentPage > 1) {
        container.appendChild(createButton('<i class="ki-filled ki-double-left text-sm text-gray-800"></i>', 1, false, false, true));
    }
    container.appendChild(createButton('<i class="ki-filled ki-black-left text-sm text-gray-800"></i>', currentPage - 1, currentPage === 1, false, true));

    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, totalPages);
    if (end - start < 2 && start > 1) {
        start = Math.max(end - 2, 1);
    }

    for (let i = start; i <= end; i++) {
        container.appendChild(createButton(i.toString(), i, false, i === currentPage));
    }
    container.appendChild(createButton('<i class="ki-filled ki-black-right text-sm text-gray-800"></i>', currentPage + 1, currentPage === totalPages, false, true));
    if (currentPage < totalPages) {
        container.appendChild(createButton('<i class="ki-filled ki-double-right text-sm text-gray-800"></i>', totalPages, false, false, true));
    }
}
