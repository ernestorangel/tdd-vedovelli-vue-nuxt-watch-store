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
    jest.clearAllMocks();
  });

  const getProducts = (quantity = 10, overrides = []) => {
    let overrideList = [];

    if (overrides.length > 0) {
      overrideList = overrides.map((override) =>
        server.create('product', override)
      );
    }

    const products = [
      ...server.createList('product', quantity),
      ...overrideList,
    ];

    return products;
  };

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = await getProducts(quantity, overrides);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('error')));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    return { wrapper, products };
  };

  it('should mount the component', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount SearchBar as child', async () => {
    const { wrapper } = await mountProductList();
    expect(wrapper.findComponent(SearchBar)).toBeDefined();
  });

  it('should call axios.get once on component mount', async () => {
    await mountProductList();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/api/products');
  });

  it('should mount ProductCard as child 10x', async () => {
    const { wrapper } = await mountProductList(10);

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });

  it('should display errorMessage when Promise rejects', async () => {
    const { wrapper } = await mountProductList(10, [], true);

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!');
  });

  it('should filter producList when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
      {
        title: 'Meu outro relógio estimado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(SearchBar);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('relógio');
    expect(cards).toHaveLength(2);
  });

  it('should filter productList when a search is performed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      {
        title: 'Meu relógio amado',
      },
    ]);

    // Act
    const search = wrapper.findComponent(SearchBar);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');
    search.find('input[type="search"]').setValue('');
    await search.find('form').trigger('submit');

    // Assert
    const cards = wrapper.findAllComponents(ProductCard);
    expect(wrapper.vm.searchTerm).toEqual('');
    expect(cards).toHaveLength(11);
  });
});
