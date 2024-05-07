"use client"

import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
  type CarouselOptions,
} from "@/components/ui/carousel"

import react, { useCallback, useEffect, useRef, useState } from "react"

const TWEEN_FACTOR_BASE_SCALE = 0.25
const TWEEN_FACTOR_BASE_OPACITY = 0.82

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

interface Props<T> {
  items: T[]
  render: (item: T) => react.ReactNode
  options?: CarouselOptions
}

const Carousel = ({ items, render, options }: Props<any>) => {
  const [api, setApi] = useState<CarouselApi>()
  const tweenScaleFactor = useRef(0)
  const tweenOpacityFactor = useRef(0)
  const tweenNodes = useRef<HTMLElement[]>([])

  const setTweenNodes = useCallback((emblaApi: CarouselApi): void => {
    if (!emblaApi) return
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__slide__number") as HTMLElement
    })
  }, [])

  const setTweenScaleFactor = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    tweenScaleFactor.current = TWEEN_FACTOR_BASE_SCALE * emblaApi.scrollSnapList().length
  }, [])
  const setTweenOpacityFactor = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    tweenOpacityFactor.current = TWEEN_FACTOR_BASE_OPACITY * emblaApi.scrollSnapList().length
  }, [])

  const tweenScaleAndOpacity = useCallback((emblaApi: CarouselApi, eventName?: string) => {
    if (!emblaApi) return
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === "scroll"

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        // Scale
        const tweenScaleValue = 1 - Math.abs(diffToTarget * tweenScaleFactor.current)
        const scale = numberWithinRange(tweenScaleValue, 0, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `scale(${scale})`

        // Opacity
        const tweenOpacityValue = 1 - Math.abs(diffToTarget * tweenOpacityFactor.current)
        const opacity = numberWithinRange(tweenOpacityValue, 0, 1).toString()
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity
      })
    })
  }, [])

  useEffect(() => {
    if (!api) return

    setTweenNodes(api)
    setTweenScaleFactor(api)
    setTweenOpacityFactor(api)
    tweenScaleAndOpacity(api)

    api
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenScaleFactor)
      .on("reInit", setTweenOpacityFactor)
      .on("reInit", tweenScaleAndOpacity)
      .on("scroll", tweenScaleAndOpacity)
  }, [api])

  return (
    <ShadcnCarousel setApi={setApi} opts={{ loop: true, align: "center", ...options }}>
      <CarouselContent>
        {items.length > 0
          ? items.map((item, i) => (
              <CarouselItem key={i} className="basis-1/2 pl-0 md:basis-1/3">
                <div className="embla__slide__number">{render(item)}</div>
              </CarouselItem>
            ))
          : null}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </ShadcnCarousel>
  )
}

export default Carousel
