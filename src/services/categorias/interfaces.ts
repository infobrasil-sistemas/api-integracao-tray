export interface ISecaoNaoIntegrada {
    SEC_CODIGO: string
    name: string; 
    slug: string | null; 
    title: string; 
    small_description: string; 
    has_acceptance_term: boolean | null; 
    acceptance_term: string | null; 
    Metatag: string | null; 
    keywords: string | null; 
    description: string | null; 
    property: string | null; 
    parent_id: string | null
  }

  export interface IGrupoNaoIntegrado {
    GRU_CODIGO: string
    name: string; 
    slug: string | null; 
    title: string; 
    small_description: string; 
    has_acceptance_term: boolean | null;
    acceptance_term: string | null; 
    Metatag: string | null; 
    keywords: string | null; 
    description: string | null; 
    property: string | null; 
    parent_id: string
  }