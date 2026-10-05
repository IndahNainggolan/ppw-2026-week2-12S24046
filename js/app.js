document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // MENGAMBIL ELEMENT DARI HTML
    // ==========================================

    const projectList = document.getElementById("projectList");
    const loadingState = document.getElementById("loadingState");
    const errorState = document.getElementById("errorState");
    const emptyState = document.getElementById("emptyState");

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

            column.innerHTML = `
                <article class="card h-100 shadow-sm">

                    <div class="card-body">

                        <div class="mb-3 fs-2 text-info">
                            <i class="bi ${project.icon}"></i>
                        </div>

                        <span class="badge bg-primary mb-2">
                            ${project.category}
                        </span>

                        <h3 class="card-title h5">
                            ${project.title}
                        </h3>

                        <p class="card-text">
                            ${project.description}
                        </p>

                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#universalProjectModal"
                            data-project-id="${project.id}"
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
                                            ${tag}
                                        </span>
                                    `
                                )
                                .join("")}

                        </div>

                    </div>
                `;

            }


            modalBody.innerHTML = `

                <div class="text-center mb-4">

                    <div class="fs-1 text-info mb-3">

                        <i class="bi ${project.icon}"></i>

                    </div>

                    <span class="badge bg-primary">
                        ${project.category}
                    </span>

                </div>


                <h3 class="h5">
                    ${project.title}
                </h3>


                <p class="mt-3">
                    ${project.description}
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
                service.icon ||
                "bi-briefcase";


            column.innerHTML = `

                <div class="card h-100 shadow-sm">

                    <div class="card-body text-center">

                        <div class="fs-1 text-info mb-3">

                            <i class="bi ${serviceIcon}"></i>

                        </div>


                        <h3 class="h5">
                            ${serviceTitle}
                        </h3>


                        <p class="text-muted">
                            ${serviceDescription}
                        </p>


                        <button
                            type="button"
                            class="btn btn-outline-primary mt-2"
                            data-bs-toggle="modal"
                            data-bs-target="#universalProjectModal"
                            data-service-id="${serviceId}"
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
            service.icon ||
            "bi-briefcase";


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
                    ${serviceTitle}
                </h3>


                <p class="mt-3">
                    ${serviceDescription}
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
    // LOCAL STORAGE
    // ==========================================

    function saveOrderToLocalStorage(order) {

        const existingOrders =
            JSON.parse(
                localStorage.getItem("serviceOrders")
            ) || [];


        existingOrders.push(order);


        localStorage.setItem(
            "serviceOrders",
            JSON.stringify(existingOrders)
        );

    }


    function getFormData(form) {

        const formData =
            new FormData(form);

        const data = {};


        formData.forEach(
            (value, key) => {

                if (data[key]) {

                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
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


        if (!toastElement) {
            return;
        }


        if (toastMessage) {
            toastMessage.textContent = message;
        }


        toastElement.classList.remove(
            "bg-success",
            "bg-danger"
        );


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


                // Validasi Bootstrap

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


                // Ambil semua data form

                const formData =
                    getFormData(serviceForm);


                // Tambahkan informasi waktu

                const payload = {

                    ...formData,

                    submittedAt:
                        new Date().toISOString()

                };


                // Disable tombol sementara

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

                        apiResponse: response,

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


                    // Reset form

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

                    // Aktifkan kembali tombol

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