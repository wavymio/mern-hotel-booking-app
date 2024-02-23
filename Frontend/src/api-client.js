const API_BASE_URL =  import.meta.env.VITE_API_BASE_URL || ''

export const register = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    const responseBody = await response.json()

    if(!response.ok) {
        throw new Error(responseBody.message)
    }
}

export const signIn = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })

    const body = await response.json()

    if (!response.ok) {
        throw new Error(body.message)
    }
    return body
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Token Invalid")
    }

    return response.json()
}

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    })

    if (!response.ok) {
        throw new Error("Error during sign-out")
    }
}

export const addMyHotel = async (hotelFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: 'POST',
        credentials: "include",
        body: hotelFormData
    })

    if (!response.ok) {
        throw new Error("Failed to add hotel")
    }

    return response.json()
}

export const fetchMyHotels = async () => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Error Fetching Hotels")
    }

    return response.json()
}

export const fetchMyHotelById = async (hotelId) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Error Fetching Hotel")
    }

    return response.json()
}

export const updatedHotelById = async (hotelFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: 'PUT',
        body: hotelFormData,
        credentials: 'include'
    })

    if (!response.ok) {
        throw new Error("Failed to update Hotel")
    }

    return response.json()
}