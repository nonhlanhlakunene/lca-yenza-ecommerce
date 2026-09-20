import crypto from 'crypto'

// Generate a PayFast signature
export const generatePayFastSignature = (
    data,
    passphrase = null
) => {


    // Create parameter string
    let parameterString = Object.entries(data)
        .filter(([key, value]) => {
            return key !== 'signature' &&
                value !== undefined &&
                value !== null &&
                value !== ''
        })
        .map(([key, value]) => {
            return `${key}=${encodeURIComponent(
                String(value).trim()
            )}`    
        })
        .join('&')

    // Add passphrase if one is configured
    if (passphrase) {
        parameterString += `&passphrase=${encodeURIComponent(
            passphrase.trim()    
        )}`
    }

    return crypto
        .createHash('md5')
        .update(parameterString)
        .digest('hex')
}


// Validate the PayFast signature
export const validatePayFastSignature = (
    data,
    passphrase = null
) => {

    const receivedSignature =data.signature

    if (!receivedSignature) {
        return false
    }

    const generatedSignature = generatePayFastSignature(
        data,
        passphrase
    )

    return receivedSignature === generatedSignature
    
}
