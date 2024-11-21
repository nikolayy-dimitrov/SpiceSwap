import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from "@angular/router";
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Feature } from '../../interfaces/feature.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('fadeIn', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('500ms ease-in')
      ])
    ]),

    trigger('sectionAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('800ms ease-out')
      ])
    ]),

    trigger('gridAnimation', [
      state('hidden', style({})),
      state('visible', style({})),
      transition('hidden => visible', [
        query('.grid-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('600ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true })
      ])
    ]),

    trigger('cardHover', [
      state('normal', style({
        transform: 'translateY(0)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      })),
      state('hovered', style({
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> hovered', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren('animatedSection') animatedSections!: QueryList<ElementRef>;

  sectionStates: { [key: string]: 'hidden' | 'visible' } = {};
  cardStates: string[] = new Array(3).fill('normal');

  features: Feature[] = [
    {
      icon: '📚',
      title: 'Extensive Collection',
      description: 'Access thousands of recipes from home cooks and professional chefs around the world.'
    },
    {
      icon: '🌟',
      title: 'Share Your Creations',
      description: 'Upload your own recipes and share your culinary masterpieces with our growing community.'
    },
    {
      icon: '💬',
      title: 'Engage & Connect',
      description: 'Comment, rate, and connect with other food enthusiasts who share your passion.'
    }
  ];

  constructor() {
    for (let i = 0; i < 6; i++) {
      this.sectionStates[`section-${i}`] = 'hidden';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupIntersectionObserver();
    });
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = (entry.target as HTMLElement).dataset['sectionId'];
        if (sectionId) {
          if (entry.isIntersecting) {
            this.sectionStates[sectionId] = 'visible';
          }
        }
      });
    }, options);

    this.animatedSections.forEach((section, index) => {
      section.nativeElement.dataset.sectionId = `section-${index}`;
      observer.observe(section.nativeElement);
    });
  }

  onCardHover(index: number, isHovered: boolean): void {
    this.cardStates[index] = isHovered ? 'hovered' : 'normal';
  }
}
