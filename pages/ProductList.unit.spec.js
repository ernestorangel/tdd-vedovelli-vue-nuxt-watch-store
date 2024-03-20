import axios from 'axios';
import Vue from 'vue';
import { mount } from '@vue/test-utils';
import ProductList from '.';
import { makeServer } from '@/miragejs/server';
import ProductCard from '@/components/ProductCard.vue';
import SearchBar from '@/components/SearchBar.vue';

jest.mock('axios', () => ({
  get: jest.fn(),
}));

describe('ProductList (Integration)', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount SearchBar as child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(SearchBar)).toBeDefined();
  });

  it('should call axios.get once on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount ProductCard as child 10x', async () => {
    const products = server.createList('product', 10);

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('should display errorMessage when Promise rejects', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('error')));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!');
  });
});