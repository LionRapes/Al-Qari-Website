import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { createRouter, createMemoryHistory } from 'vue-router'

import TheHeader from '../header/TheHeader.vue'
import HeaderLogo from '../header/HeaderLogo.vue'
import DesktopNav from '../header/DesktopNav.vue'
import MobileNav from '../header/MobileNav.vue'
import UserProfile from '../header/UserProfile.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/quran', component: { template: '<div>Quran</div>' } },
    { path: '/profile', component: { template: '<div>Profile</div>' } },
  ],
})

const mockNavigation = [
  { name: 'Home', path: '/' },
  { name: 'Quran', path: '/quran' },
  { name: 'Profile', path: '/profile' },
]

describe('TheHeader.vue', () => {
  beforeEach(async () => {
    router.push('/')
    await router.isReady()
  })

  const mountHeader = () => {
    return mount(TheHeader, {
      global: {
        plugins: [router],
      },
      props: {
        navigation: mockNavigation,
      },
    })
  }

  it('renders all child components on mount', () => {
    const wrapper = mountHeader()

    expect(wrapper.findComponent(HeaderLogo).exists()).toBe(true)
    expect(wrapper.findComponent(DesktopNav).exists()).toBe(true)
    expect(wrapper.findComponent(UserProfile).exists()).toBe(true)
    expect(wrapper.findComponent(MobileNav).exists()).toBe(true)
  })

  it('passes the correct navigation props to the Nav components', () => {
    const wrapper = mountHeader()

    expect(wrapper.findComponent(DesktopNav).props('items')).toEqual(mockNavigation)
    expect(wrapper.findComponent(MobileNav).props('items')).toEqual(mockNavigation)
  })

  it('passes the correct user data to the UserProfile component', () => {
    const wrapper = mountHeader()
    const userProfile = wrapper.findComponent(UserProfile)

    expect(userProfile.props('name')).toBe('Амир Ибн Тарик')
    expect(userProfile.props('tier')).toBe('Premium')
  })

  it('toggles the mobile menu state when HeaderLogo emits "toggle"', async () => {
    const wrapper = mountHeader()

    const mobileNav = wrapper.findComponent(MobileNav)
    const headerLogo = wrapper.findComponent(HeaderLogo)
    expect(mobileNav.props('isOpen')).toBe(false)
    expect(headerLogo.props('isMobileMenuOpen')).toBe(false)

    await headerLogo.vm.$emit('toggle')

    expect(wrapper.findComponent(MobileNav).props('isOpen')).toBe(true)
    expect(wrapper.findComponent(HeaderLogo).props('isMobileMenuOpen')).toBe(true)
  })

  it('closes the mobile menu when MobileNav emits "close"', async () => {
    const wrapper = mountHeader()
    const headerLogo = wrapper.findComponent(HeaderLogo)
    const mobileNav = wrapper.findComponent(MobileNav)

    await headerLogo.vm.$emit('toggle')
    expect(mobileNav.props('isOpen')).toBe(true)

    await mobileNav.vm.$emit('close')

    expect(wrapper.findComponent(MobileNav).props('isOpen')).toBe(false)
  })
})
