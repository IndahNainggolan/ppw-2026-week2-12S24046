const ApiService = {

    async fetchProjects() {
        try {
            const response = await fetch("./data/projects.json");

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("[API Error] Gagal mengambil projects:", error);
            throw error;
        }
    },

    async fetchProfile() {
        try {
            const response = await fetch("./data/profile.json");

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("[API Error] Gagal mengambil profile:", error);
            throw error;
        }
    },

    async fetchServices() {
        try {
            const response = await fetch("./data/services.json");

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("[API Error] Gagal mengambil services:", error);
            throw error;
        }
    },

    async submitServiceOrder(payload) {
        try {
            const response = await fetch(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error("[API Error] Gagal mengirim order:", error);
            throw error;
        }
    }
};