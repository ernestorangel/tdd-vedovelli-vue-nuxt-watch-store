import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard.vue';
import { makeServer } from '~/miragejs/server';

let server;

const mountProductCard = () => {
  const product = server.create('product', {
    title: 'Relógio bonito',
  });
  return {
    wrapper: mount(ProductCard, {
      propsData: {
        product,
      },
    }),
    product,
  };
};

describe('ProductCard (Unit)', () => {
  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const { wrapper } = mountProductCard();

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Relógio bonito');
  });

  it('should emit the event addToCart on button press', async () => {
    const { wrapper, product } = mountProductCard();

    await wrapper.find('button').trigger('click');

    expect(wrapper.emitted().addToCart).toBeTruthy();
    expect(wrapper.emitted().addToCart.length).toBe(1);
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]);
  });
});
