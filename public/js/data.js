/* ============================================================================
   YOUR PROJECTS
   ----------------------------------------------------------------------------
   This is the only file you need to touch to add, remove or reorder work.
   Everything else on the site stays as it is.

   To add a project, copy one block between { } and paste it into the list.
   To remove one, delete its block. Order in this list = order on the page.

   FIELD GUIDE
     title        Shown as the project heading.
     category     The small line under the title. Write it however you like.
     tags         Which filter buttons this project appears under.
                  Pick from: "food", "pet", "home", "cleaning", "consumer"
     description  One or two sentences. Keep it short.
     thumbnail    Path to the still image. Put yours in assets/images/
     alt          Describes the image for screen readers and search engines.
     video        A YouTube link, a Vimeo link, or a path to your own .mp4.
                  Leave it as "" and the card shows without a play button.
     preview      Optional 3 to 6 second silent .mp4 that plays on hover.
                  Leave as "" to skip it.
     duration     Optional run time badge, e.g. "0:30". Use "" to hide it.
     format       Optional, shown in the video window, e.g. "16:9".
     size         Controls how wide the card is on desktop:
                  "lg" = wide, "sm" = narrow, "md" = half.
                  Alternating lg / sm is what gives the grid its rhythm.
   ========================================================================== */

const PROJECTS = [
  {
    title: "Premium Pet Food Commercial",
    category: "Pet · Food · Commercial",
    tags: ["pet", "food"],
    description:
      "A cinematic product advertisement created to showcase the product through engaging visual storytelling.",
    thumbnail: "assets/images/thumb-01-pet-food.svg",
    alt: "Pet food bowl lit as a product still on a dark set",
    video: "",
    preview: "",
    duration: "0:30",
    format: "16:9",
    size: "lg"
  },
  {
    title: "Food Product Commercial",
    category: "Food · Product Advertising",
    tags: ["food"],
    description:
      "Packaging, texture and appetite appeal built into a single continuous product sequence.",
    thumbnail: "assets/images/thumb-02-food-product.svg",
    alt: "Packaged food jar photographed against a dark backdrop",
    video: "",
    preview: "",
    duration: "0:20",
    format: "16:9",
    size: "sm"
  },
  {
    title: "Home Product Commercial",
    category: "Home · Household",
    tags: ["home"],
    description:
      "A quiet, warm treatment that places the product inside the room it belongs in.",
    thumbnail: "assets/images/thumb-03-home-product.svg",
    alt: "Ceramic home object shaped by soft directional light",
    video: "",
    preview: "",
    duration: "0:25",
    format: "16:9",
    size: "sm"
  },
  {
    title: "Household Product Ad",
    category: "Household · Consumer",
    tags: ["cleaning", "home"],
    description:
      "Motion, surface and result shown in sequence so the product's job reads in seconds.",
    thumbnail: "assets/images/thumb-04-household.svg",
    alt: "Spray bottle rendered as a clean product hero shot",
    video: "",
    preview: "",
    duration: "0:15",
    format: "9:16",
    size: "lg"
  },
  {
    title: "Food & Beverage Campaign",
    category: "Food · Beverage",
    tags: ["food"],
    description:
      "A set of cut-downs built from one shoot, sized for feed, story and pre-roll.",
    thumbnail: "assets/images/thumb-05-beverage.svg",
    alt: "Beverage can standing in a pool of rim light",
    video: "",
    preview: "",
    duration: "0:30",
    format: "16:9",
    size: "md"
  },
  {
    title: "Consumer Product Commercial",
    category: "Consumer · Product Advertising",
    tags: ["consumer"],
    description:
      "Form and detail carried by camera movement rather than on-screen copy.",
    thumbnail: "assets/images/thumb-06-consumer.svg",
    alt: "Geometric consumer product form floating in darkness",
    video: "",
    preview: "",
    duration: "0:20",
    format: "16:9",
    size: "md"
  }
];

/* ============================================================================
   FEATURED PROJECT
   ----------------------------------------------------------------------------
   The large case study section. Same fields as above, plus the four
   breakdown lines. Swap in whichever project you want to lead with.
   ========================================================================== */

const FEATURED = {
  title: "Premium Pet Food Campaign",
  category: "Pet Food · Commercial Advertising",
  thumbnail: "assets/images/featured-pet-food.svg",
  alt: "Pet food campaign hero frame lit as a cinematic product still",
  video: "",
  preview: "",
  duration: "0:45",
  format: "16:9",
  breakdown: [
    { label: "Concept", text: "Product-focused commercial storytelling." },
    {
      label: "Visual direction",
      text: "Cinematic lighting, composition, movement, and product-focused visuals."
    },
    { label: "Production", text: "AI visuals, CGI, animation, editing." },
    { label: "Format", text: "Short-form commercial advertisement." }
  ]
};
