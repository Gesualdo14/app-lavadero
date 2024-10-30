const focus = (id: string) => {
  document.getElementById(id)?.focus();
};

const click = (id: string) => {
  document.getElementById(id)?.click();
};

export const focusAfter = (
  id: string,
  miliseconds: number = 50,
  open: boolean = false
) => {
  if (miliseconds === 0) {
    focus(id);
    if (open) click(id);
  } else {
    setTimeout(() => {
      focus(id);
      if (open) click(id);
    }, miliseconds);
  }
};
