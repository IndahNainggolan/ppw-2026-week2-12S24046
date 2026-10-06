document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // MENGAMBIL ELEMENT DARI HTML
    // ==========================================

    const projectList =
        document.getElementById("projectList");

    const loadingState =
        document.getElementById("loadingState");

    const errorState =
        document.getElementById("errorState");

    const emptyState =
        document.getElementById("emptyState");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const serviceList =
        document.getElementById("serviceList");

    const serviceSelect =
        document.getElementById("service");

    const modalTitle =
        document.getElementById("projectModalTitle");

    const modalBody =
        document.getElementById("projectModalBody");

    const serviceForm =
        document.getElementById("serviceForm");

    const orderCount =
        document.getElementById("orderCount");


    // ==========================================
    // HELPER SECURITY
    // ==========================================

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function safeIconClass(icon) {

        const value = String(icon || "bi-briefcase");

        if (/^bi-[a-z0-9-]+$/i.test(value)) {
            return value;
        }

        return "bi-briefcase";
    }


    // ==========================================
    // STATUS LOADING
    // ==========================================

    function showLoading() {

        if (loadingState) {
            loadingState.classList.remove("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }
    }


    function showError() {

        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (errorState) {
            errorState.classList.remove("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }
    }


    function showEmpty() {

        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.remove("d-none");
        }
    }


    function hideStates() {

        if (loadingState) {
            loadingState.classList.add("d-none");
        }

        if (errorState) {
            errorState.classList.add("d-none");
        }

        if (emptyState) {
            emptyState.classList.add("d-none");
        }
    }


    // ==========================================
    // LOCAL STORAGE
    // ==========================================

    function getStoredOrders() {

        try {

            return JSON.parse(
                localStorage.getItem("serviceOrders")
            ) || [];

        } catch (error) {

            console.error(
                "Gagal membaca LocalStorage:",
                error
            );

            return [];
        }
    }


    function updateOrderBadge() {

        if (!orderCount) {
            return;
        }

        const orders = getStoredOrders();

        orderCount.textContent = orders.length;
    }


    function saveOrderToLocalStorage(order) {

        const existingOrders =
            getStoredOrders();

        existingOrders.push(order);

        localStorage.setItem(
            "serviceOrders",
            JSON.stringify(existingOrders)
        );

        updateOrderBadge();
    }


    // ==========================================
    // MENAMPILKAN PROJECT
    // ==========================================

    function renderProjects(projects) {

        if (!projectList) {
            return;
        }

        projectList.innerHTML = "";

        if (!projects || projects.length === 0) {

            showEmpty();

            return;
        }


        projects.forEach((project) => {

            const column =
                document.createElement("div");

            column.className = "col";


            const icon =
                safeIconClass(project.icon);

            const category =
                escapeHTML(project.category);

            const title =
                escapeHTML(project.title);

            const description =
                escapeHTML(project.description);

            const projectId =
                escapeHTML(project.id);


            column.innerHTML = `
                <article class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="mb-3 fs-2 text-info">

                            <i class="bi ${icon}"></i>

                        </div>


                        <span class="badge bg-primary mb-2">

                            ${category}

                        </span>


                        <h3 class="card-title h5">

                            ${title}

                        </h3>


                        <p class="card-text">

                            ${description}

                        </p>


                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#universalProjectModal"
                            data-project-id="${projectId}"
                        >

                            <i class="bi bi-eye me-1"></i>

                            Lihat Detail

                        </button>

                    </div>

                </article>
            `;


            projectList.appendChild(column);

        });


        hideStates();
    }


    // ==========================================
    // FILTER PROJECT
    // ==========================================

    function setupCategoryFilter(projects) {

        if (!categoryFilter) {
            return;
        }


        categoryFilter.innerHTML = `
            <option value="all">
                Semua Kategori
            </option>
        `;


        const categories = [
            ...new Set(
                projects.map(
                    (project) => project.category
                )
            )
        ];


        categories.forEach((category) => {

            const option =
                document.createElement("option");

            option.value = category;

            option.textContent = category;

            categoryFilter.appendChild(option);

        });


        categoryFilter.addEventListener(
            "change",
            () => {

                const selectedCategory =
                    categoryFilter.value;


                if (selectedCategory === "all") {

                    renderProjects(projects);

                    return;
                }


                const filteredProjects =
                    projects.filter(
                        (project) =>
                            project.category ===
                            selectedCategory
                    );


                renderProjects(filteredProjects);

            }
        );

    }


    // ==========================================
    // DETAIL PROJECT
    // ==========================================

    function showProjectModal(project) {

        if (!project) {
            return;
        }


        if (modalTitle) {

            modalTitle.textContent =
                project.title;

        }


        if (modalBody) {

            let tagsHTML = "";


            if (
                project.tags &&
                project.tags.length > 0
            ) {

                tagsHTML = `
                    <div class="mt-4">

                        <h3 class="h6">
                            Teknologi / Tags
                        </h3>

                        <div>

                            ${project.tags
                                .map(
                                    (tag) => `
                                        <span class="badge bg-secondary me-1 mb-1">

                                            ${escapeHTML(tag)}

                                        </span>
                                    `
                                )
                                .join("")}

                        </div>

                    </div>
                `;
            }


            const icon =
                safeIconClass(project.icon);

            const category =
                escapeHTML(project.category);

            const title =
                escapeHTML(project.title);

            const description =
                escapeHTML(project.description);


            modalBody.innerHTML = `

                <div class="text-center mb-4">

                    <div class="fs-1 text-info mb-3">

                        <i class="bi ${icon}"></i>

                    </div>


                    <span class="badge bg-primary">

                        ${category}

                    </span>

                </div>


                <h3 class="h5">

                    ${title}

                </h3>


                <p class="mt-3">

                    ${description}

                </p>


                ${tagsHTML}

            `;
        }

    }


    // ==========================================
    // MENAMPILKAN LAYANAN
    // ==========================================

    function renderServices(services) {

        if (!serviceList) {
            return;
        }


        serviceList.innerHTML = "";


        if (!services || services.length === 0) {

            serviceList.innerHTML = `

                <div class="col-12">

                    <div class="alert alert-secondary">

                        Belum ada layanan yang tersedia.

                    </div>

                </div>

            `;

            return;
        }


        services.forEach((service, index) => {

            const column =
                document.createElement("div");

            column.className = "col";


            const serviceId =
                service.id ?? index + 1;


            const serviceTitle =
                service.title ||
                service.name ||
                service.service ||
                "Layanan";


            const serviceDescription =
                service.description ||
                service.detail ||
                service.desc ||
                "Layanan untuk membantu kebutuhan pengguna.";


            const serviceIcon =
                safeIconClass(service.icon);


            column.innerHTML = `

                <div class="card h-100 shadow-sm">

                    <div class="card-body text-center">

                        <div class="fs-1 text-info mb-3">

                            <i class="bi ${serviceIcon}"></i>

                        </div>


                        <h3 class="h5">

                            ${escapeHTML(serviceTitle)}

                        </h3>


                        <p class="text-muted">

                            ${escapeHTML(serviceDescription)}

                        </p>


                        <button
                            type="button"
                            class="btn btn-outline-primary mt-2"
                            data-bs-toggle="modal"
                            data-bs-target="#universalProjectModal"
                            data-service-id="${escapeHTML(serviceId)}"
                        >

                            <i class="bi bi-info-circle me-1"></i>

                            Lihat Detail

                        </button>

                    </div>

                </div>

            `;


            serviceList.appendChild(column);

        });

    }


    // ==========================================
    // OPTION LAYANAN DI FORM
    // ==========================================

    function renderServiceOptions(services) {

        if (!serviceSelect) {
            return;
        }


        serviceSelect.innerHTML = `

            <option value="" selected disabled>

                Pilih layanan

            </option>

        `;


        services.forEach((service) => {

            const option =
                document.createElement("option");


            const serviceTitle =
                service.title ||
                service.name ||
                service.service ||
                "Layanan";


            option.value = serviceTitle;

            option.textContent = serviceTitle;


            serviceSelect.appendChild(option);

        });

    }


    // ==========================================
    // DETAIL LAYANAN
    // ==========================================

    function showServiceModal(service) {

        if (!service) {
            return;
        }


        const serviceTitle =
            service.title ||
            service.name ||
            service.service ||
            "Layanan";


        const serviceDescription =
            service.description ||
            service.detail ||
            service.desc ||
            "Informasi layanan belum tersedia.";


        const serviceIcon =
            safeIconClass(service.icon);


        if (modalTitle) {

            modalTitle.textContent =
                serviceTitle;

        }


        if (modalBody) {

            modalBody.innerHTML = `

                <div class="text-center mb-4">

                    <div class="fs-1 text-info mb-3">

                        <i class="bi ${serviceIcon}"></i>

                    </div>

                </div>


                <h3 class="h5">

                    ${escapeHTML(serviceTitle)}

                </h3>


                <p class="mt-3">

                    ${escapeHTML(serviceDescription)}

                </p>


                <div class="alert alert-info mt-4">

                    <i class="bi bi-info-circle me-2"></i>

                    Layanan ini dapat disesuaikan
                    dengan kebutuhan pengguna.

                </div>

            `;

        }

    }


    // ==========================================
    // EVENT KLIK PROJECT DAN LAYANAN
    // ==========================================

    function setupClickEvents(
        projects,
        services
    ) {

        document.addEventListener(
            "click",
            (event) => {


                // --------------------------
                // PROJECT
                // --------------------------

                const projectButton =
                    event.target.closest(
                        "[data-project-id]"
                    );


                if (projectButton) {

                    const projectId =
                        Number(
                            projectButton.dataset.projectId
                        );


                    const selectedProject =
                        projects.find(
                            (project) =>
                                Number(project.id) ===
                                projectId
                        );


                    showProjectModal(
                        selectedProject
                    );


                    return;
                }


                // --------------------------
                // LAYANAN
                // --------------------------

                const serviceButton =
                    event.target.closest(
                        "[data-service-id]"
                    );


                if (serviceButton) {

                    const serviceId =
                        Number(
                            serviceButton.dataset.serviceId
                        );


                    const selectedService =
                        services.find(
                            (service, index) => {

                                const currentId =
                                    service.id ??
                                    index + 1;


                                return (
                                    Number(currentId) ===
                                    serviceId
                                );

                            }
                        );


                    showServiceModal(
                        selectedService
                    );

                }

            }
        );

    }


    // ==========================================
    // FORM DATA
    // ==========================================

    function getFormData(form) {

        const formData =
            new FormData(form);

        const data = {};


        formData.forEach(
            (value, key) => {

                if (data[key]) {

                    if (!Array.isArray(data[key])) {

                        data[key] =
                            [data[key]];

                    }

                    data[key].push(value);

                } else {

                    data[key] = value;

                }

            }
        );


        return data;
    }


    // ==========================================
    // TOAST
    // ==========================================

    function showToast(
        message,
        type = "success"
    ) {

        const toastElement =
            document.getElementById(
                "feedbackToast"
            );


        const toastMessage =
            document.getElementById(
                "toastMessage"
            );


        const toastTitle =
            document.getElementById(
                "toastTitle"
            );


        if (!toastElement) {
            return;
        }


        if (toastMessage) {

            toastMessage.textContent =
                message;

        }


        toastElement.classList.remove(
            "bg-success",
            "bg-danger"
        );


        if (toastTitle) {

            if (type === "success") {

                toastTitle.textContent =
                    "Berhasil";

            } else {

                toastTitle.textContent =
                    "Gagal";

            }

        }


        if (type === "success") {

            toastElement.classList.add(
                "bg-success"
            );

        } else {

            toastElement.classList.add(
                "bg-danger"
            );

        }


        const toast =
            new bootstrap.Toast(
                toastElement
            );


        toast.show();

    }


    // ==========================================
    // FORM SUBMIT + POST API
    // ==========================================

    function setupForm() {

        if (!serviceForm) {
            return;
        }


        serviceForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                // ----------------------------------
                // VALIDASI BOOTSTRAP
                // ----------------------------------

                if (!serviceForm.checkValidity()) {

                    event.stopPropagation();

                    serviceForm.classList.add(
                        "was-validated"
                    );

                    return;
                }


                serviceForm.classList.add(
                    "was-validated"
                );


                // ----------------------------------
                // AMBIL DATA FORM
                // ----------------------------------

                const formData =
                    getFormData(serviceForm);


                const payload = {

                    ...formData,

                    submittedAt:
                        new Date().toISOString()

                };


                // ----------------------------------
                // DISABLE TOMBOL
                // ----------------------------------

                const submitButton =
                    serviceForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled = true;

                    submitButton.innerHTML = `

                        <span
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        ></span>

                        Mengirim...

                    `;

                }


                try {

                    // ==================================
                    // KIRIM DATA KE API
                    // ==================================

                    const response =
                        await ApiService.submitServiceOrder(
                            payload
                        );


                    // ==================================
                    // SIMPAN KE LOCAL STORAGE
                    // ==================================

                    saveOrderToLocalStorage({

                        ...payload,

                        apiResponse:
                            response,

                        savedAt:
                            new Date().toISOString()

                    });


                    // ==================================
                    // TAMPILKAN PESAN BERHASIL
                    // ==================================

                    showToast(
                        "Permintaan berhasil dikirim dan disimpan.",
                        "success"
                    );


                    // ----------------------------------
                    // RESET FORM
                    // ----------------------------------

                    serviceForm.reset();

                    serviceForm.classList.remove(
                        "was-validated"
                    );


                } catch (error) {

                    console.error(
                        "Gagal mengirim permintaan:",
                        error
                    );


                    showToast(
                        "Gagal mengirim permintaan. Silakan coba lagi.",
                        "error"
                    );


                } finally {

                    // ----------------------------------
                    // AKTIFKAN KEMBALI TOMBOL
                    // ----------------------------------

                    if (submitButton) {

                        submitButton.disabled = false;

                        submitButton.innerHTML = `

                            <i class="bi bi-send me-1"></i>

                            Kirim Permintaan

                        `;

                    }

                }

            }
        );

    }


    // ==========================================
    // LOAD DATA
    // ==========================================

    try {

        showLoading();


        // ==================================
        // UPDATE BADGE LOCAL STORAGE
        // ==================================

        updateOrderBadge();


        // ==================================
        // AMBIL DATA JSON
        // ==================================

        const [
            projects,
            services
        ] = await Promise.all([

            ApiService.fetchProjects(),

            ApiService.fetchServices()

        ]);


        // ==================================
        // TAMPILKAN PROJECT
        // ==================================

        renderProjects(projects);

        setupCategoryFilter(projects);


        // ==================================
        // TAMPILKAN LAYANAN
        // ==================================

        renderServices(services);

        renderServiceOptions(services);


        // ==================================
        // AKTIFKAN KLIK PROJECT + LAYANAN
        // ==================================

        setupClickEvents(
            projects,
            services
        );


        // ==================================
        // AKTIFKAN FORM
        // ==================================

        setupForm();


    } catch (error) {

        console.error(
            "Terjadi kesalahan:",
            error
        );


        showError();

    }

});