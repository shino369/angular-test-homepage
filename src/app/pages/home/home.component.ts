import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import * as _ from 'lodash'
import { round } from 'lodash'
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.parallax()
    console.log(this.keyArr)
  }

  keyArr: any = []
  parallax() {
    // Register the ScrollTrigger plugin with gsap
    gsap.registerPlugin(ScrollTrigger)
    //Loop over all the sections and set animations
    gsap.utils.toArray('section').forEach((section: any, i) => {
      // Set the bg variable for the section
      this.keyArr.push(section)
      section.bg = section.querySelector('.bg')
      section.textWrapperL = section.querySelector('.textWrapperL')
      section.textWrapperR = section.querySelector('.textWrapperR')

      // Give the backgrounds some random images
      section.bg.style.backgroundImage = `url(https://picsum.photos/${1280}/${720}?random=${i}&blur=${3})`

      // Set the initial position for the background
      section.bg.style.backgroundPosition = `50% ${-innerHeight / 2}px`

      // Do the parallax effect on each section
      gsap.to(section.bg, {
        backgroundPosition: `50% ${innerHeight / 2}px`,
        // y: '-10%',
        ease: 'none', // Don't apply any easing function.
        scrollTrigger: {
          // Trigger the animation as soon as the section comes into view
          trigger: section,
          // Animate on scroll/scrub
          scrub: true,
        },
      })

      if (section.textWrapperL) {
        gsap.to(section.textWrapperL, {
          translateX:
            window.innerWidth / 2 - section.textWrapperL.offsetWidth / 2,
          // x: () => window.innerWidth / 2 - section.textWrapperL.offsetWidth / 2,
          duration: 3,
          // rotation: 360,
          ease: 'none',
          scrollTrigger: {
            // Trigger the animation as soon as the section comes into view
            trigger: section.textWrapperL,
            // Animate on scroll/scrub
            start: 'center bottom',
            end: 'center center',
            scrub: 1,
            // markers: true,
          },
        })
      }

      if (section.textWrapperR) {
        gsap.to(section.textWrapperR, {
          x: () =>
            -(window.innerWidth / 2 - section.textWrapperR.offsetWidth / 2),
          duration: 3,
          // rotation: 360,
          ease: 'none',
          scrollTrigger: {
            // Trigger the animation as soon as the section comes into view
            trigger: section.textWrapperR,
            // Animate on scroll/scrub
            start: 'center bottom',
            end: 'center center',
            scrub: 1,
            // markers: true,
          },
        })
      }
    })
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  private debouncedOnScroll = _.debounce(
    (deltaY: number) => {
      console.log(deltaY)
      const offset = round(window.scrollY / window.innerHeight)
      this.scroll(
        deltaY > 0
          ? this.keyArr[this.keyArr.length - 1 === offset ? 0 : offset + 1]
          : this.keyArr[offset === 0 ? offset : offset - 1]
      )
    },
    50,
    {}
  )

  yBefore = 0
  yAfter = 0
  yCurrent = 0

  onTouchStart(event: any) {
    this.yBefore = event.touches[0].clientY
  }

  onTouchEnd(event: any) {
    this.yAfter = event.changedTouches[0].clientY
    this.debouncedOnScroll(this.yBefore - this.yAfter)
  }

  @HostListener('wheel', ['$event'])
  onScroll(event: any) {
    console.log(event.type)
    if (event.type === 'wheel') {
      event.preventDefault()
      this.debouncedOnScroll(event.deltaY)
    }
  }
}