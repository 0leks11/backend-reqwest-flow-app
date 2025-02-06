import mockOrganizations from "./mockOrganizations.json";
import mockChatResponse from "./mockChatResponse.json";

export interface Organization {
  id: string;
  name: string;
  children?: Organization[];
}

export interface OrganizationsResponse {
  content: Organization[];
  page: number;
  totalElements: number;
  totalPages: number;
  size: number;
}

export interface ChatResponse {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  collections: { id: string; name: string }[];
  documents: { id: string; name: string }[];
  embeddings: {
    content: string;
    cosineDistance: string;
    document: {
      id: string;
      metadata: {
        title: string;
        documentAbstract: string;
        authors: { name: string }[];
        doi: string;
        extraFields: Record<string, unknown>;
        publishDate: string;
      };
    };
  }[];
  attachments: unknown[];
}

//Organisation reqwest:
export async function getOrganizations(): Promise<OrganizationsResponse> {
  //real POST-reqwest
  fetch(
    "https://api.example.com/v1/organizations/3fa85f64-5717-4562-b3fc-2c963f66afa6/children",
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("REAL RESPONSE (getOrganizations):", data);
    })
    .catch((error) => {
      console.error("REAL Child-Org REQUEST ERROR (getOrganizations):", error);
    });

  //moced Data income
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockOrganizations as OrganizationsResponse);
    }, 500);
  });
}

//real POST-reqwest + (mockChatResponse).
export async function getChatAnswer(
  selectedOrgIds: string[],
  prompt: string
): Promise<ChatResponse> {
  //real POST-reqwest
  fetch("https://api.example.com/v1/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentIds: selectedOrgIds,
      prompt: {
        question: prompt,
      },
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("REAL RESPONSE (getChatAnswer):", data);
    })
    .catch((error) => {
      console.error(
        "REAL REQUEST to some Child-Org ERROR (getChatAnswer):",
        error
      );
    });

  // moced Data income
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...mockChatResponse,
        question: prompt,
        answer: `Information about Organizations [${selectedOrgIds.join(
          ", "
        )}]: ${mockChatResponse.answer}`,
      } as ChatResponse);
    }, 500);
  });
}
