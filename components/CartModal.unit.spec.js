import { mount } from '@vue/test-utils';
import CartModal from '@/components/CartModal';

describe('CartModal', () => {
  it('should mount the component', () => {
    const wrapper = mount(CartModal);
    expect(wrapper.vm).toBeDefined();
  });

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(CartModal);
    const button = wrapper.find('[data-testid="close-button"]');

    await button.trigger('click');

    expect(wrapper.emitted().close).toBeTruthy();
    expect(wrapper.emitted().close).toHaveLength(1);
  });

  it('should hide the cart when no prop isOpen is passed', () => {
    const wrapper = mount(CartModal);

    expect(wrapper.classes()).toContain('hidden');
  });

  it('should display the cart when prop isOpen is passed', () => {
    const wrapper = mount(CartModal, {
      propsData: {
        isOpen: true,
      },
    });

    expect(wrapper.classes()).not.toContain('hidden');
  });
});
