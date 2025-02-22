import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate = (data: InvoiceType) => {
    const { sender, receiver, details } = data;

    return (
        <InvoiceLayout data={data}>
            <div className="font-['Helvetica'] max-w-[612px] mx-auto p-[50px] min-h-[792px] bg-white">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-[24px] font-bold text-[#4D4D4D]">
                            Invoice #
                        </h2>
                        <span className="mt-1 block text-[12px] text-[#808080]">
                            {details.invoiceNumber}
                        </span>
                        <h1 className="mt-[35px] text-[18px] font-bold text-[#0087B5]">
                            {sender.name}
                        </h1>
                    </div>
                    <div>
                        {details.invoiceLogo && (
                            <img
                                src={details.invoiceLogo}
                                width={140}
                                height={100}
                                alt={`Logo of ${sender.name}`}
                                className="max-h-[100px] w-auto object-contain"
                            />
                        )}
                        <address className="mt-4 not-italic text-[12px] text-[#4D4D4D] leading-[15px] text-right">
                            {sender.address}
                            <br />
                            {sender.zipCode}, {sender.city}
                            <br />
                            {sender.country}
                            <br />
                        </address>
                    </div>
                </div>

                <div className="mt-[50px] grid grid-cols-2 gap-3">
                    <div>
                        <h3 className="text-[14px] font-bold text-[#4D4D4D]">
                            Bill to:
                        </h3>
                        <h3 className="text-[14px] font-bold text-[#4D4D4D]">
                            {receiver.name}
                        </h3>
                        <address className="mt-2 not-italic text-[12px] text-[#808080] leading-[15px]">
                            {receiver.address}, {receiver.zipCode}
                            <br />
                            {receiver.city}, {receiver.country}
                            <br />
                        </address>
                    </div>
                    <div className="text-right space-y-[15px]">
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                            <dt className="text-[12px] font-bold text-[#4D4D4D]">
                                Invoice date:
                            </dt>
                            <dd className="text-[12px] text-[#808080]">
                                {new Date(details.invoiceDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                            </dd>
                        </dl>
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                            <dt className="text-[12px] font-bold text-[#4D4D4D]">
                                Due date:
                            </dt>
                            <dd className="text-[12px] text-[#808080]">
                                {new Date(details.dueDate).toLocaleDateString("en-US", DATE_OPTIONS)}
                            </dd>
                        </dl>
                    </div>
                </div>

                <div className="mt-[45px]">
                    <div className="border border-[#E6E6E6] rounded-lg overflow-hidden">
                        <div className="grid grid-cols-[50%_15%_15%_20%] px-4 py-2 bg-white">
                            <div className="text-[12px] font-bold text-[#808080] uppercase">Item</div>
                            <div className="text-[12px] font-bold text-[#808080] uppercase">Qty</div>
                            <div className="text-[12px] font-bold text-[#808080] uppercase">Rate</div>
                            <div className="text-right text-[12px] font-bold text-[#808080] uppercase">Amount</div>
                        </div>
                        <div className="divide-y divide-[#E6E6E6]">
                            {details.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-[50%_15%_15%_20%] px-4 py-3">
                                    <div>
                                        <p className="text-[12px] font-normal text-[#4D4D4D]">{item.name}</p>
                                        {item.description && (
                                            <p className="text-[10px] text-[#808080] mt-1 whitespace-pre-line">{item.description}</p>
                                        )}
                                    </div>
                                    <div className="text-[12px] text-[#4D4D4D]">{item.quantity}</div>
                                    <div className="text-[12px] text-[#4D4D4D]">{item.unitPrice}</div>
                                    <div className="text-right text-[12px] text-[#4D4D4D]">
                                        {item.total} {details.currency}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-[30px] flex justify-end">
                    <div className="w-[300px] space-y-[15px]">
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                            <dt className="text-[12px] font-bold text-[#4D4D4D]">Subtotal:</dt>
                            <dd className="text-right text-[12px] text-[#808080]">
                                {formatNumberWithCommas(Number(details.subTotal))} {details.currency}
                            </dd>
                        </dl>
                        {details.discountDetails?.amount != undefined && details.discountDetails?.amount > 0 && (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                                <dt className="text-[12px] font-bold text-[#4D4D4D]">Discount:</dt>
                                <dd className="text-right text-[12px] text-[#808080]">
                                    {details.discountDetails.amountType === "amount"
                                        ? `- ${details.discountDetails.amount} ${details.currency}`
                                        : `- ${details.discountDetails.amount}%`}
                                </dd>
                            </dl>
                        )}
                        {details.taxDetails?.amount != undefined && details.taxDetails?.amount > 0 && (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                                <dt className="text-[12px] font-bold text-[#4D4D4D]">Tax:</dt>
                                <dd className="text-right text-[12px] text-[#808080]">
                                    {details.taxDetails.amountType === "amount"
                                        ? `+ ${details.taxDetails.amount} ${details.currency}`
                                        : `+ ${details.taxDetails.amount}%`}
                                </dd>
                            </dl>
                        )}
                        {details.shippingDetails?.cost != undefined && details.shippingDetails?.cost > 0 && (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end">
                                <dt className="text-[12px] font-bold text-[#4D4D4D]">Shipping:</dt>
                                <dd className="text-right text-[12px] text-[#808080]">
                                    {details.shippingDetails.costType === "amount"
                                        ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                        : `+ ${details.shippingDetails.cost}%`}
                                </dd>
                            </dl>
                        )}
                        <dl className="grid grid-cols-[auto_1fr] gap-x-3 justify-end border-t border-[#E6E6E6] pt-[15px]">
                            <dt className="text-[12px] font-bold text-[#4D4D4D]">Total:</dt>
                            <dd className="text-right text-[12px] text-[#808080]">
                                {formatNumberWithCommas(Number(details.totalAmount))} {details.currency}
                            </dd>
                        </dl>
                    </div>
                </div>

                <div className="mt-[45px] space-y-[30px]">
                    {details.paymentInformation && (
                        <div>
                            <h4 className="text-[14px] font-bold text-[#0087B5] mb-[15px]">
                                Payment Information:
                            </h4>
                            <div className="space-y-[15px]">
                                {details.paymentInformation.paymentType === 'bankTransfer' ? (
                                    <>
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Bank: </span>
                                            <span className="text-[#4D4D4D]">{details.paymentInformation.bankName}</span>
                                        </p>
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Account name: </span>
                                            <span className="text-[#4D4D4D]">{details.paymentInformation.accountName}</span>
                                        </p>
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Account no: </span>
                                            <span className="text-[#4D4D4D]">{details.paymentInformation.accountNumber}</span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Network: </span>
                                            <span className="text-[#4D4D4D]">Stellar</span>
                                        </p>
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Public Key: </span>
                                            <span className="text-[#4D4D4D]">{details.paymentInformation.publicKey}</span>
                                        </p>
                                        {details.paymentInformation.memo && (
                                            <p className="text-[12px]">
                                                <span className="font-bold text-[#4D4D4D]">Memo: </span>
                                                <span className="text-[#4D4D4D]">{details.paymentInformation.memo}</span>
                                            </p>
                                        )}
                                        <p className="text-[12px]">
                                            <span className="font-bold text-[#4D4D4D]">Currency: </span>
                                            <span className="text-[#4D4D4D]">{details.paymentInformation.currency}</span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <h4 className="text-[12px] font-bold text-[#4D4D4D] mb-[15px]">
                            Contact Information:
                        </h4>
                        <div className="space-y-[15px]">
                            <p className="text-[12px] text-[#808080]">{sender.email}</p>
                            <p className="text-[12px] text-[#808080]">{sender.phone}</p>
                        </div>
                    </div>

                    {details?.signature?.data && (
                        <div>
                            <h4 className="text-[12px] font-bold text-[#4D4D4D] mb-[15px]">
                                Signature:
                            </h4>
                            {isDataUrl(details.signature.data) ? (
                                <img
                                    src={details.signature.data}
                                    width={120}
                                    height={60}
                                    alt={`Signature of ${sender.name}`}
                                    className="object-contain"
                                />
                            ) : (
                                <p
                                    style={{
                                        fontSize: "24px",
                                        fontFamily: `${details.signature.fontFamily}, cursive`,
                                    }}
                                    className="text-[#4D4D4D]"
                                >
                                    {details.signature.data}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate;
