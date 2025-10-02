import { createRouter, createWebHistory } from 'vue-router'
import CountryListView from '@/views/CountryListView.vue'
import AboutView from '@/views/AboutView.vue'
import CountryService from '@/services/CountryService'
import SportService from '@/services/SportsService'
import CountryLayoutView from '@/views/event/LayoutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NetworkErrorView from '@/views/NetworkErrorView.vue'
import nProgress from 'nprogress'
import DetailView from '@/views/event/DetailView.vue'
import CheerupView from '@/views/event/CheerupView.vue'
import { useCountryStore } from '@/stores/country'
import { useSportStore } from '@/stores/sport'
import CountryForm from '@/views/event/CountryForm.vue'
import SportForm from '@/views/event/SportForm.vue'
import LoginRegister from '@/views/LoginRegister.vue'
import UserListView from '@/views/UserListView.vue'
import ManageCounrty from '@/views/ManageCounrty.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/medal-list-view',
      name: 'medal-list-view',
      component: CountryListView,
      props: (route) => ({
        page: parseInt(route.query.page?.toString() || '1'),
        pageSize: parseInt(route.query.pageSize?.toString() || '10')
      })
    },
    {
      path: '/:id',
      name: 'country-layout-view',
      component: CountryLayoutView,
      props: true,
      beforeEnter: (to) => {
        // put API call here
        const id = parseInt(to.params.id as string)
        const CountryStore = useCountryStore()
        return CountryService.getCountryid(id)
        .then ((response) => {
          // need to setup the data for the event
          CountryStore.setCountry(response.data)
        }) 
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            return {
              name: '404-resource-view',
              params: { resource: 'event' }
            }
          } else{
            return { name: 'network-error-view' }
          }
        })
      },
      children: [
        {
          path: '',
          name: 'country-detail-view',
          component: DetailView,
          props: true
        },
        {
          path: 'Cheer-up',
          name: 'country-cheerup-view',
          component: CheerupView,
          props: true
        },
      ]
    },
    {
      path: '/manageCountry',
      name: 'manageCountry',
      component: ManageCounrty,
      props: (route) => ({
        page: parseInt(route.query.page?.toString() || '1'),
        pageSize: parseInt(route.query.pageSize?.toString() || '10')
      })
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true
    },
    {
      path: '/network-error',
      name: 'network-error-view',
      component: NetworkErrorView
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView
    },
    {
      path: '/country-form',
      name: 'country-form',
      component: CountryForm
    },
    {
      path: '/sport-form/:countryId',
      name: 'sport-form-with-country',
      component: SportForm,
      props: true
    },
    {
      path: '/',
      name: 'login-register',
      component: LoginRegister
    },
    {
      path: '/users',
      name: 'users',
      component: UserListView
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

export default router
