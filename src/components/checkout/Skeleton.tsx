"use client";

type SkeletonProps = {
  className?: string
}

export function SkeletonLine({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#e1e1e1] rounded ${className}`} />
  )
}

export function CheckoutSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] pb-40 md:pb-24">
      <div className="flex flex-row flex-wrap w-full min-h-full">
        <div className="w-full md:basis-[66.667%] md:max-w-[66.667%] px-5 md:pl-12 md:pr-8 py-8 md:py-10">
          <div className="mx-auto w-full max-w-[640px] space-y-6">
            <div className="flex justify-center">
              <SkeletonLine className="h-8 w-64" />
            </div>
            <SkeletonLine className="h-4 w-48 mx-auto" />
            <div className="border border-[#d9d9d9] p-6 space-y-4">
              <SkeletonLine className="h-5 w-20" />
              <SkeletonLine className="h-11 w-full" />
              <SkeletonLine className="h-11 w-full" />
              <SkeletonLine className="h-12 w-full" />
            </div>
            <div className="border border-[#d9d9d9] p-6 space-y-4">
              <SkeletonLine className="h-5 w-32" />
              <SkeletonLine className="h-11 w-full" />
              <SkeletonLine className="h-12 w-full" />
            </div>
            <div className="border border-[#d9d9d9] p-6 space-y-4">
              <SkeletonLine className="h-5 w-36" />
              <SkeletonLine className="h-4 w-56" />
              <SkeletonLine className="h-12 w-full" />
            </div>
          </div>
        </div>
        <div className="hidden md:block md:basis-[33.333%] md:max-w-[33.333%] border-l border-[#e1e1e1] px-6 py-8 md:pl-8 md:pr-7 space-y-4">
          <SkeletonLine className="h-6 w-40" />
          <SkeletonLine className="h-20 w-full" />
          <SkeletonLine className="h-20 w-full" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-full" />
          <SkeletonLine className="h-4 w-3/4" />
          <SkeletonLine className="h-6 w-full" />
        </div>
      </div>
    </div>
  )
}

export function ShippingOptionsSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLine className="h-14 w-full" />
      <SkeletonLine className="h-14 w-full" />
    </div>
  )
}

export function PaymentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex border border-[#d9d9d9]">
        <SkeletonLine className="flex-1 h-11 rounded-none" />
        <SkeletonLine className="flex-1 h-11 rounded-none" />
      </div>
      <SkeletonLine className="h-32 w-full" />
    </div>
  )
}
