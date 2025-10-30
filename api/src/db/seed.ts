import { db } from "./index"
import { webhooks } from "./schema"
import { uuidv7 } from "uuidv7"

// IPs do Stripe (reais)
const stripeIps = [
    "54.187.174.169",
    "54.187.205.235",
    "54.187.216.72",
    "54.241.31.99",
    "54.241.31.102",
    "54.241.34.107"
]

// Eventos do Stripe
const stripeEvents = [
    "payment_intent.succeeded",
    "payment_intent.created",
    "payment_intent.payment_failed",
    "charge.succeeded",
    "charge.failed",
    "charge.refunded",
    "customer.created",
    "customer.updated",
    "customer.deleted",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "invoice.created",
    "invoice.paid",
    "invoice.payment_failed",
    "checkout.session.completed",
    "checkout.session.expired",
    "payment_method.attached",
    "payment_method.detached",
    "payout.created",
    "payout.paid",
    "payout.failed"
]

// Moedas
const currencies = ["usd", "brl", "eur", "gbp"]

// Status de pagamento
const paymentStatuses = ["succeeded", "pending", "failed", "canceled"]

// Métodos de pagamento
const paymentMethods = ["card", "boleto", "pix"]

// Nomes de clientes
const customerNames = [
    "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa",
    "Carlos Souza", "Julia Lima", "Rafael Alves", "Beatriz Rocha",
    "Lucas Martins", "Fernanda Dias", "Gabriel Ferreira", "Camila Ribeiro"
]

// Emails
const emailDomains = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "empresa.com.br"]

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomAmount(): number {
    const amounts = [1000, 2500, 5000, 9900, 15000, 25000, 49900, 99900, 150000]
    return randomItem(amounts)
}

function generateEmail(name: string): string {
    const cleanName = name.toLowerCase().replace(" ", ".")
    return `${cleanName}@${randomItem(emailDomains)}`
}

function generateStripeId(prefix: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let id = prefix + "_"
    for (let i = 0; i < 24; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return id
}

function generateStripeSignature(): string {
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
    ).join("")
    return `t=${timestamp},v1=${signature}`
}

function createStripePayload(eventType: string) {
    const customerName = randomItem(customerNames)
    const customerId = generateStripeId("cus")
    const amount = randomAmount()
    const currency = randomItem(currencies)
    
    const basePayload = {
        id: generateStripeId("evt"),
        object: "event",
        api_version: "2023-10-16",
        created: Math.floor(Date.now() / 1000),
        type: eventType,
        livemode: false,
        pending_webhooks: 1,
        request: {
            id: generateStripeId("req"),
            idempotency_key: uuidv7()
        }
    }

    if (eventType.startsWith("payment_intent")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: generateStripeId("pi"),
                    object: "payment_intent",
                    amount,
                    currency,
                    status: eventType.includes("succeeded") ? "succeeded" : 
                           eventType.includes("failed") ? "failed" : "processing",
                    customer: customerId,
                    description: `Pagamento de ${customerName}`,
                    payment_method: generateStripeId("pm"),
                    payment_method_types: [randomItem(paymentMethods)],
                    created: Math.floor(Date.now() / 1000),
                    metadata: {
                        order_id: `ORD-${Math.floor(Math.random() * 100000)}`,
                        customer_name: customerName
                    }
                }
            }
        }
    }

    if (eventType.startsWith("charge")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: generateStripeId("ch"),
                    object: "charge",
                    amount,
                    currency,
                    status: eventType.includes("succeeded") ? "succeeded" : "failed",
                    customer: customerId,
                    description: `Cobrança de ${customerName}`,
                    payment_method: generateStripeId("pm"),
                    created: Math.floor(Date.now() / 1000),
                    refunded: eventType.includes("refunded"),
                    receipt_email: generateEmail(customerName)
                }
            }
        }
    }

    if (eventType.startsWith("customer.subscription")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: generateStripeId("sub"),
                    object: "subscription",
                    customer: customerId,
                    status: eventType.includes("deleted") ? "canceled" : "active",
                    current_period_start: Math.floor(Date.now() / 1000),
                    current_period_end: Math.floor(Date.now() / 1000) + 2592000,
                    plan: {
                        id: generateStripeId("plan"),
                        amount,
                        currency,
                        interval: "month",
                        product: generateStripeId("prod")
                    },
                    metadata: {
                        customer_name: customerName
                    }
                }
            }
        }
    }

    if (eventType.startsWith("customer") && !eventType.includes("subscription")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: customerId,
                    object: "customer",
                    email: generateEmail(customerName),
                    name: customerName,
                    created: Math.floor(Date.now() / 1000),
                    metadata: {
                        user_id: Math.floor(Math.random() * 10000).toString()
                    }
                }
            }
        }
    }

    if (eventType.startsWith("invoice")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: generateStripeId("in"),
                    object: "invoice",
                    customer: customerId,
                    amount_due: amount,
                    amount_paid: eventType.includes("paid") ? amount : 0,
                    currency,
                    status: eventType.includes("paid") ? "paid" : 
                           eventType.includes("failed") ? "open" : "draft",
                    created: Math.floor(Date.now() / 1000),
                    customer_email: generateEmail(customerName),
                    customer_name: customerName
                }
            }
        }
    }

    if (eventType.startsWith("checkout.session")) {
        return {
            ...basePayload,
            data: {
                object: {
                    id: generateStripeId("cs"),
                    object: "checkout.session",
                    customer: customerId,
                    amount_total: amount,
                    currency,
                    status: eventType.includes("completed") ? "complete" : "expired",
                    payment_status: eventType.includes("completed") ? "paid" : "unpaid",
                    customer_email: generateEmail(customerName),
                    created: Math.floor(Date.now() / 1000),
                    metadata: {
                        order_id: `ORD-${Math.floor(Math.random() * 100000)}`
                    }
                }
            }
        }
    }

    return basePayload
}

(async () => {
    try {
        console.log("🌱 Seeding database with Stripe webhooks...")
        
        const seedData = Array.from({ length: 60 }, () => {
            const eventType = randomItem(stripeEvents)
            const payload = createStripePayload(eventType)
            const body = JSON.stringify(payload)
            
            return {
                id: uuidv7(),
                method: "POST",
                pathname: "/webhooks/stripe",
                ip: randomItem(stripeIps),
                statusCode: 200,
                contentType: "application/json",
                contentLength: body.length,
                queryParameters: null,
                headers: {
                    "content-type": "application/json",
                    "user-agent": "Stripe/1.0 (+https://stripe.com/docs/webhooks)",
                    "stripe-signature": generateStripeSignature(),
                    "accept": "*/*",
                    "content-length": body.length.toString()
                },
                body
            }
        })
        
        await db.insert(webhooks).values(seedData)
        
        console.log("✅ Database seeded successfully with 60 Stripe webhooks!")
    } catch (error) {
        console.error("❌ Error seeding database:", error)
        process.exit(1)
    } finally {
        process.exit(0)
    }
})()