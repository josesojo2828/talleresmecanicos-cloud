import { FormStructure } from './generic.form';

/**
 * Módulo de Finanzas
 * Definiciones para: BankAccount, CryptoWallet y Transaction.
 */

// --- BANK ACCOUNT ---
export const BankAccountForm: FormStructure = {
    slug: 'bank-account',
    title: 'finance.bankAccount.title',
    fields: [
        {
            name: 'accountNumber',
            label: 'finance.accountNumber',
            type: 'text',
            validation: { required: true, minLength: 10 }
        },
        {
            name: 'userId',
            label: 'finance.user',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        },
        {
            name: 'currencyId',
            label: 'finance.currency',
            type: 'autocomplete',
            gridCols: 2,
            remote: { slug: 'CURRENCY' },
            validation: { required: true }
        },
        {
            name: 'status',
            label: 'finance.status',
            type: 'select',
            gridCols: 2,
            options: [
                { label: 'finance.status.active', value: 'ACTIVE' },
                { label: 'finance.status.inactive', value: 'INACTIVE' },
                { label: 'finance.status.blocked', value: 'BLOCKED' }
            ],
            defaultValue: 'ACTIVE'
        },
        {
            name: 'availableBalance',
            label: 'finance.availableBalance',
            type: 'number',
            gridCols: 2,
            defaultValue: 0,
            validation: { required: true, min: 0 }
        },
        {
            name: 'lockedBalance',
            label: 'finance.lockedBalance',
            type: 'number',
            gridCols: 2,
            defaultValue: 0,
            validation: { required: true, min: 0 }
        }
    ]
};

// --- CRYPTO WALLET ---
export const CryptoWalletForm: FormStructure = {
    slug: 'crypto-wallet',
    title: 'finance.cryptoWallet.title',
    fields: [
        {
            name: 'address',
            label: 'finance.wallet.address',
            type: 'text',
            validation: { required: true }
        },
        {
            name: 'userId',
            label: 'finance.user',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        },
        {
            name: 'currencyId',
            label: 'finance.currency',
            type: 'autocomplete',
            gridCols: 2,
            remote: { slug: 'CURRENCY' },
            validation: { required: true }
        },
        {
            name: 'isActive',
            label: 'finance.isActive',
            type: 'switch',
            gridCols: 2,
            defaultValue: true
        },
        {
            name: 'privateKey',
            label: 'finance.wallet.privateKey',
            type: 'password',
            validation: { required: true }
        },
        {
            name: 'publicKey',
            label: 'finance.wallet.publicKey',
            type: 'text',
            validation: { required: true }
        }
    ]
};

// --- TRANSACTION ---
export const TransactionForm: FormStructure = {
    slug: 'transaction',
    title: 'finance.transaction.title',
    fields: [
        {
            name: 'amount',
            label: 'finance.transaction.amount',
            type: 'number',
            validation: { required: true, min: 0.00000001 }
        },
        {
            name: 'userId',
            label: 'finance.user',
            type: 'autocomplete',
            remote: { slug: 'USER' },
            validation: { required: true }
        },
        {
            name: 'currencyId',
            label: 'finance.currency',
            type: 'autocomplete',
            gridCols: 2,
            remote: { slug: 'CURRENCY' },
            validation: { required: true }
        },
        {
            name: 'blockchainNetwork',
            label: 'finance.transaction.network',
            type: 'text',
            gridCols: 2,
            placeholder: 'Ej: ERC-20, TRC-20'
        },
        {
            name: 'type',
            label: 'finance.transaction.type',
            type: 'select',
            gridCols: 2,
            options: [
                { label: 'finance.type.deposit', value: 'DEPOSIT' },
                { label: 'finance.type.withdrawal', value: 'WITHDRAWAL' },
                { label: 'finance.type.transfer', value: 'TRANSFER' }
            ],
            validation: { required: true }
        },
        {
            name: 'status',
            label: 'finance.transaction.status',
            type: 'select',
            gridCols: 2,
            options: [
                { label: 'finance.status.pending', value: 'PENDING' },
                { label: 'finance.status.completed', value: 'COMPLETED' },
                { label: 'finance.status.failed', value: 'FAILED' }
            ],
            defaultValue: 'PENDING'
        },
        {
            name: 'bankAccountId',
            label: 'finance.bankAccount',
            type: 'autocomplete',
            remote: { slug: 'BANKACCOUNT', dependsOn: 'currencyId' }
        },
        {
            name: 'cryptoWalletId',
            label: 'finance.cryptoWallet',
            type: 'autocomplete',
            remote: { slug: 'CRYPTOWALLET', dependsOn: 'currencyId' }
        }
    ]
};