import React, {Children, useId, useLayoutEffect, useRef, useState} from 'react';
import styles from './Carousel.module.sass'
import {classNames} from '~/lib/helpers'
import {Item} from "~/ui/Carousel/components";

/* ------------------------------ *
 * Props
 * ----------------------------- */

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'horizontal' | 'vertical'
    count?: boolean
    activeIndex?: number | null
    className?: string
    /* Child node */
    children?: React.ReactNode;
}

export default function Carousel(props: CarouselProps) {
    /* ------------------------------ *
     * Initial State
     * ----------------------------- */

    const {
        direction = 'horizontal',
        count,
        activeIndex = -1,
        className,
        children,
        ...rest
    } = props

    const carouselRef = useRef<HTMLDivElement>(null!)
    const itemRef = useRef<HTMLDivElement[]>([])

    const [activeSlide, setActiveSlide] = useState<number>(activeIndex!)
    const id = useId()
    const itemCount = count || Children.count(children)

    /* ------------------------------ *
     * Effects
     * ----------------------------- */

    useLayoutEffect(() => {
        // @ts-ignore
        if (activeIndex >= 0) {
            setActiveSlide(activeIndex as number)
            scrollToItem(activeIndex as number)
        } else {
            setTimeout(() => {
                console.log('Initial scroll')
                setActiveSlide(0)
                scrollToItem(0)
            }, 500)
        }
    }, [activeIndex])

    /* ------------------------------ *
     * Methods
     * ----------------------------- */

    const scrollToItem = (slideIndex: number) => {
        const slide = itemRef.current[slideIndex]

        if (slide) {
            slide.scrollIntoView({behavior: "smooth", block: "center", inline: "center"})
        }
    }

    /* ------------------------------ *
     * Classes
     * ----------------------------- */

    const carouselClasses = classNames(
        styles.Carousel,
        direction === 'horizontal' ? styles.Horizontal : styles.Vertical,
        className
    )

    /* ------------------------------ *
     * Markup
     * ----------------------------- */

    /* ------------------------------ *
     * Return
     * ----------------------------- */

    return (
        <div
            className={carouselClasses}
            ref={carouselRef}
            { ...rest }
        >
            {Children.map(children, (child: HTMLDivElement, i: number) => {
                return (
                    <Item
                        key={`Item-${i}`}
                        id={`${id}${i}`}
                        ref={(element: HTMLDivElement) => itemRef.current.push(element)}
                    >{child}</Item>
                )
            })}
        </div>
    )
}
