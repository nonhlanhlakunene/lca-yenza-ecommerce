import crypto from 'crypto'

// Generates MD5 signature
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


// Compares PayFast signature with server generated signature
export const validatePayFastSignature = (
    data,
    passphrase = null
) => {

    const receivedSignature =data.signature

    if (!receivedSignature) {
        return false
    }

    const generatedSignature = 
        generatePayFastSignature(
            data,
            passphrase
        )

    return (
        receivedSignature.toLowerCase() ===
        generatedSignature.toLowerCase()
    )
}


// Confirm ITN with PayFast
export const validatePayFastServerConfirmation = async (
    data
) => {
    const payfastUrl =
        process.env.PAYFAST_URL ||
        'https://sandbox.payfast.co.za/eng/process'

    
    const validationUrl =
        payfastUrl.includes('sandbox')
            ? 'https://sandbox.payfast.co.za/eng/query/validate'
            : 'https://www.payfast.co.za/eng/query/validate'


    const parameterString =
        Object.entries(data)
            .map(([key, value]) => {
                return `${key}=${encodeURIComponent(
                    String(value)
                )}`
            })
            .join('&')

    try {
        const response = await fetch(
            validationUrl,
            {
                method: 'POST',
                headers: {
                    'Content-Type':
                        'application/x-www-form-urlencoded'
                },
                body: parameterString
            }
        )

        const result = await response.text()

        console.log(
            'PayFast server validation:',
            result
        )

        return result.trim() ==='VALID'

    } catch (error) {
        console.error(
            'PayFast server validation error:',
            error
        )
        return false
    }
}